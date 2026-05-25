# Deployment Instructions for Delhivery & Payment Fix

## Issue Summary
Orders were being placed but not created in the database and no Delhivery shipments were being created. Root causes:

1. **DELHIVERY_API_KEY** environment variable was incorrectly named (was trying to use the literal API key value as the env var name)
2. **Missing debugging logs** made it impossible to identify order creation failures

## What Was Fixed
✅ Fixed environment variable retrieval in edge functions  
✅ Added comprehensive logging for debugging  
✅ Fixed payment verification signature logging  

## Deployment Steps

### 1. Ensure Supabase CLI is Installed
```bash
which supabase
```

If not installed:
```bash
brew install supabase
```

### 2. Set Environment Variables

Set the Delhivery API key in your Supabase project:

```bash
supabase secrets set DELHIVERY_API_KEY=cfd9a034f9f8becf1e48ed158f046a6852a7267c
```

**OR** manually in Supabase Dashboard:
- Go to: Settings > Edge Functions > Environment variables
- Add: `DELHIVERY_API_KEY` = `cfd9a034f9f8becf1e48ed158f046a6852a7267c`

### 3. Deploy Edge Functions

From the project root:

```bash
supabase functions deploy
```

This will update all edge functions with the latest code.

### 4. Verify Deployment

Check logs by visiting your Supabase project dashboard:
- Functions > [function-name] > Logs

You should see the new logging output when you place an order.

## Testing the Fix

1. **Add items to cart** on the website
2. **Go to checkout** and fill in shipping details
3. **Complete payment** via Razorpay
4. **Check results**:
   - ✅ Order should appear in Supabase `orders` table
   - ✅ Order should appear in Delhivery dashboard with AWB number
   - ✅ Tracking number should be saved in `orders.tracking_number`

## Debugging If It Still Doesn't Work

If orders still aren't being created, check the function logs:

1. Go to Supabase Dashboard > Edge Functions > verify-razorpay-payment > Logs
2. Look for these indicators:
   - "Signature verification" log — shows if payment signature validated
   - "Cart fetch" log — shows if cart items were found
   - "Creating order with payload" log — shows order data being saved
   - "Order creation response" log — shows result of database insert

## Expected Logs for Successful Order

```
Signature verification - Order: [order-id] Expected: [sig]... Received: [sig]...
Cart fetch - User ID: [user-id] Cart items count: 1 Cart error: null
Creating order with payload: {user_id: [...], order_number: [...], total_amount: [...], status: processing}
Order creation response - Error: null Order ID: [new-order-id]
Calling Delhivery function: [url]
Delhivery response: {success: true, packages: [{waybill: [awb-number]}]}
Shipment created with AWB: [awb-number]
```

## Files Modified
- `supabase/functions/create-delhivery-shipment/index.ts` — Fixed env var
- `supabase/functions/verify-razorpay-payment/index.ts` — Added logging
- `supabase/functions/test-delhivery/index.ts` — Fixed env var
