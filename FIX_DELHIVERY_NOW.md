# Quick Fix: Get Delhivery Orders Working NOW

## What You Need To Do (5 minutes)

### 1. Set Environment Variables in Supabase

Go to: **Supabase Dashboard** → **Settings** → **Edge Functions** → **Environment variables**

Copy and paste these 9 variables with their values:

```
DELHIVERY_API_KEY = cfd9a034f9f8becf1e48ed158f046a6852a7267c
DELHIVERY_RETURN_PHONE = 9999999999
DELHIVERY_RETURN_PIN = 500068
DELHIVERY_RETURN_CITY = Hyderabad
DELHIVERY_RETURN_STATE = Telangana
DELHIVERY_RETURN_ADDRESS = Durga Elevate, Hyderabad
DELHIVERY_SELLER_ADDRESS = Durga Elevate, Hyderabad, Telangana
DELHIVERY_SELLER_GST = (your GST number if you have one, or leave empty)
DELHIVERY_PICKUP_LOCATION_NAME = Durga Elevate
```

### 2. Redeploy Edge Functions

Run this command from your project directory:
```bash
supabase functions deploy
```

### 3. Test It

1. Go to your website
2. Add product to cart
3. Go to checkout
4. Fill shipping details - IMPORTANT: Use a valid state name from the dropdown
5. Complete payment
6. Check if order appears in Delhivery dashboard

### 4. If Still Not Working

Check the logs:
1. Go to Supabase Dashboard
2. Functions → **verify-razorpay-payment** → Logs
3. Find your recent order
4. Look for "Delhivery response:" and "Delhivery error message:"
5. Share the error message with me

## Common Problems & Quick Fixes

| Problem | Solution |
|---------|----------|
| No orders appearing on Delhivery | Check if all 9 env vars are set, then redeploy |
| "return_phone is required" error | Make sure DELHIVERY_RETURN_PHONE is set to `9999999999` |
| "Invalid state code" error | Use exact state name: "Telangana" not "telangana" |
| Functions not seeing env vars | Run `supabase functions deploy` to redeploy |
| Still no orders | Check logs and share error message |

## Files Changed

These files have been updated with better logging and default values:
- ✅ `supabase/functions/create-delhivery-shipment/index.ts` - Added logging, fixed return_phone default
- ✅ `supabase/functions/verify-razorpay-payment/index.ts` - Added detailed error logging
- ✅ Created `DELHIVERY_SETUP.md` - Complete setup guide
- ✅ Created `FIX_DELHIVERY_NOW.md` - This file

## What Happens When It Works

When you place an order after these changes:

1. ✅ Order saved in database
2. ✅ Order sent to Delhivery API
3. ✅ Delhivery creates shipment
4. ✅ Tracking number saved in database
5. ✅ You can track shipment on Delhivery dashboard

## Still Need Help?

If after these steps orders still aren't appearing on Delhivery:

1. Place a test order
2. Check the Supabase function logs
3. Share the "Delhivery error message:" or "Delhivery response:" from the logs
4. Include any error details shown

The most common issues are:
- Missing environment variables
- Functions not redeployed after env var changes
- Invalid shipping address data in checkout form
