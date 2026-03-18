from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List
import uuid
import re
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# API Key authentication dependency
async def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")):
    expected_key = os.environ.get("API_KEY")
    if not expected_key:
        raise HTTPException(status_code=500, detail="Server misconfiguration")
    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

    @validator('client_name')
    def sanitize_client_name(cls, v):
        if not v or not v.strip():
            raise ValueError('client_name cannot be empty')
        v = v.strip()
        if len(v) > 200:
            raise ValueError('client_name must be 200 characters or less')
        if re.search(r'[\$\{\}]', v):
            raise ValueError('client_name contains invalid characters')
        return v

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck, dependencies=[Depends(verify_api_key)])
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck], dependencies=[Depends(verify_api_key)])
async def get_status_checks(skip: int = 0, limit: int = 100):
    if limit > 100:
        limit = 100
    if skip < 0:
        skip = 0
    status_checks = await db.status_checks.find().skip(skip).limit(limit).to_list(limit)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

# Parse CORS origins - reject wildcard
cors_origins_raw = os.environ.get('CORS_ORIGINS', '')
cors_origins = [o.strip() for o in cors_origins_raw.split(',') if o.strip() and o.strip() != '*']
if not cors_origins:
    cors_origins = []  # No origins allowed if only wildcard or empty

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-API-Key"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
