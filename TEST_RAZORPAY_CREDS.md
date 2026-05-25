# Testing Razorpay Credentials

The "Authentication failed" error means your Razorpay KEY_ID or KEY_SECRET is incorrect or invalid.

## How to Verify Your Credentials

### Step 1: Check Your Razorpay Dashboard
1. Go to https://dashboard.razorpay.com/
2. Navigate to: **Settings** → **API Keys**
3. You'll see two keys:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret** (long alphanumeric string)

### Step 2: Verify Format
- **Key ID should be**: ~14 characters, starts with `rzp_test_` or `rzp_live_`
- **Key Secret should be**: ~32 characters long

### Step 3: Check if Credentials are Active
- Make sure the API keys are **enabled** in your Razorpay dashboard
- If you recently regenerated keys, the old ones won't work

### Step 4: Update Supabase with Correct Credentials

If your credentials are different, update them with this command:

```bash
# Replace with your actual credentials
supabase secrets set \
  RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXX \
  RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Then redeploy:
```bash
supabase functions deploy
```

## Possible Issues

1. **Keys are test vs live mode mixed**
   - Make sure both KEY_ID and KEY_SECRET are from the same mode (both test or both live)

2. **Keys were regenerated**
   - If keys were regenerated in Razorpay, update them in Supabase

3. **Whitespace or typos**
   - Check there's no extra whitespace in the keys

4. **Wrong order**
   - KEY_ID should be set to the short key (rzp_test_... or rzp_live_...)
   - KEY_SECRET should be set to the long secret

## Quick Test

Once you update the credentials:

1. Redeploy: `supabase functions deploy`
2. Try placing an order again
3. Check logs: Supabase → Functions → create-razorpay-order → Logs

You should see either:
- ✅ "Razorpay order created successfully: [order_id]"
- ❌ "Authentication failed" (if credentials still wrong)
- ❌ "Cart is empty" (if no items in cart)

## Need Help?

If you're still getting "Authentication failed":
1. Verify credentials in Razorpay dashboard
2. Make sure keys are enabled (not disabled)
3. Double-check there's no whitespace in the key values
4. Check that test and live modes match
