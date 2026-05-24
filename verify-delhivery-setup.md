# Delhivery Integration - Setup Verification

## Issue Found
The Delhivery integration was failing because the edge functions were trying to read an environment variable with an incorrect name.

### Root Cause
- **create-delhivery-shipment/index.ts** (line 4): `Deno.env.get("cfd9a034f9f8becf1e48ed158f046a6852a7267c")`
- **test-delhivery/index.ts** (line 4): `Deno.env.get("cfd9a034f9f8becf1e48ed158f046a6852a7267c")`

This was trying to get an environment variable named after the actual API key value, instead of a properly named variable like `DELHIVERY_API_KEY`.

### Fix Applied ✅
Changed both files to use: `Deno.env.get("DELHIVERY_API_KEY")`

## Required Configuration

To complete the setup, you must add the `DELHIVERY_API_KEY` environment variable to your Supabase project:

### Steps to Add Environment Variable:
1. Go to your Supabase project dashboard
2. Navigate to **Settings > Edge Functions**
3. Click **Environment variables** or look for a "Secrets" section
4. Add a new variable:
   - **Name**: `DELHIVERY_API_KEY`
   - **Value**: `cfd9a034f9f8becf1e48ed158f046a6852a7267c`
5. Save the configuration

### Verification
After adding the environment variable, the next order placed will:
1. Be successfully created in the database ✅
2. Be sent to Delhivery API ✅
3. Return an AWB (Air Way Bill) number ✅
4. Save the tracking number to `orders.tracking_number` ✅

## Testing
You can test by:
1. Placing a test order with a shipping address
2. Checking the Delhivery dashboard for the new shipment
3. Verifying the tracking number is saved in the Supabase orders table

## Environment Variables Now Correctly Used
- `DELHIVERY_API_KEY` - Your Delhivery API authentication token
- `DELHIVERY_RETURN_PIN` - Fallback: "500068"
- `DELHIVERY_RETURN_CITY` - Fallback: "Hyderabad"
- `DELHIVERY_RETURN_PHONE` - Fallback: "" (empty)
- `DELHIVERY_RETURN_ADDRESS` - Fallback: "Durga Elevate, Hyderabad"
- `DELHIVERY_RETURN_STATE` - Fallback: "Telangana"
- `DELHIVERY_SELLER_ADDRESS` - Fallback: "Durga Elevate, Hyderabad, Telangana"
- `DELHIVERY_SELLER_GST` - Fallback: "" (empty)
- `DELHIVERY_PICKUP_LOCATION_NAME` - Fallback: "Durga Elevate"

## Files Modified
- `supabase/functions/create-delhivery-shipment/index.ts` - Fixed env var retrieval
- `supabase/functions/test-delhivery/index.ts` - Fixed env var retrieval
