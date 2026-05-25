# Delhivery Integration Setup Guide

## Problem
Orders are being created in the database but not appearing on Delhivery's side.

## Solution: Configure Supabase Environment Variables

You need to set the following environment variables in your Supabase project. These tell the edge function what details to use when creating shipments.

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com and log in to your project
2. Navigate to: **Settings** → **Edge Functions** → **Environment variables**

### Step 2: Add Required Environment Variables

Add the following variables:

| Variable Name | Value | Description |
|---|---|---|
| `DELHIVERY_API_KEY` | `cfd9a034f9f8becf1e48ed158f046a6852a7267c` | Your Delhivery API key |
| `DELHIVERY_RETURN_PHONE` | `9999999999` | Return shipment phone number (must be 10 digits) |
| `DELHIVERY_RETURN_PIN` | `500068` | Return shipment postal code |
| `DELHIVERY_RETURN_CITY` | `Hyderabad` | Return shipment city |
| `DELHIVERY_RETURN_STATE` | `Telangana` | Return shipment state |
| `DELHIVERY_RETURN_ADDRESS` | `Durga Elevate, Hyderabad` | Return shipment address |
| `DELHIVERY_SELLER_ADDRESS` | `Durga Elevate, Hyderabad, Telangana` | Your seller address |
| `DELHIVERY_SELLER_GST` | `[Your GST Number]` | Your GST number (if applicable) |
| `DELHIVERY_PICKUP_LOCATION_NAME` | `Durga Elevate` | Your pickup location name |

### Step 3: Redeploy Edge Functions

After setting the variables, you need to redeploy the functions:

**Option A: Using Supabase CLI**
```bash
# From your project root directory
supabase functions deploy
```

**Option B: Manual - In Supabase Dashboard**
1. Go to **Functions** → **create-delhivery-shipment**
2. The function will automatically redeploy when env vars change

### Step 4: Test the Setup

1. Go to your website and add an item to cart
2. Proceed to checkout
3. Fill in shipping details (make sure all fields are correct)
4. Complete payment via Razorpay
5. Check results:
   - ✅ Order appears in Supabase (Database → orders table)
   - ✅ Order appears in Delhivery dashboard
   - ✅ Tracking number is in orders.tracking_number

### Step 5: Verify with Logs

If orders still aren't appearing on Delhivery:

1. Go to Supabase: **Functions** → **verify-razorpay-payment** → **Logs**
2. Find your recent order (timestamp should be recent)
3. Look for these log lines:
   - "Calling Delhivery function:" - confirms we're calling Delhivery
   - "Delhivery response:" - shows what Delhivery is saying
   - Look for error messages in the response

### Common Issues & Solutions

**Issue 1: "return_phone is required"**
- Solution: Set `DELHIVERY_RETURN_PHONE` to a valid 10-digit number

**Issue 2: "Invalid state code"**
- Solution: Use valid Indian state names (e.g., "Telangana", "Karnataka", "Maharashtra")

**Issue 3: "seller_gst_tin is required"**
- Solution: Set `DELHIVERY_SELLER_GST` with your GST number

**Issue 4: "API key not found"**
- Solution: Verify `DELHIVERY_API_KEY` is set exactly as shown above
- Redeploy functions after changing

**Issue 5: Still no orders on Delhivery**
- Check that shipping address in checkout has all required fields:
  - First Name
  - Last Name
  - Address
  - City
  - State (as dropdown - must be valid Indian state)
  - Postal Code (6 digits)
  - Phone (10 digits)

### Manual Environment Variable Setup

If Supabase CLI isn't available, set them manually:

1. Go to Supabase Dashboard
2. Settings → Edge Functions → Environment variables
3. Click "Add new variable"
4. Fill in Name and Value
5. Click "Add variable"
6. Repeat for all 9 variables above

### What Happens After Setup

When an order is placed:

1. **verify-razorpay-payment** function processes the payment
2. It calls **create-delhivery-shipment** function
3. That function sends shipment data to Delhivery API
4. Delhivery returns an AWB (tracking number)
5. We save the AWB in the database
6. Order status changes to "shipped"

### Troubleshooting Checklist

- [ ] All 9 environment variables are set in Supabase
- [ ] DELHIVERY_API_KEY is exactly: `cfd9a034f9f8becf1e48ed158f046a6852a7267c`
- [ ] DELHIVERY_RETURN_PHONE is 10 digits
- [ ] DELHIVERY_SELLER_GST is set if required by Delhivery account
- [ ] Edge functions have been redeployed after adding variables
- [ ] Test order has all required shipping fields
- [ ] Check function logs for error messages

### Next Steps

After setting up environment variables:

1. Place a test order on your website
2. Check Supabase logs for the Delhivery response
3. Verify order appears in Delhivery dashboard
4. Confirm tracking number is saved in orders table

If still having issues, share the error message from the Delhivery response logs.
