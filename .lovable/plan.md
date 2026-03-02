

## Plan: Secure Payment-Order-Shipping Flow + Banner Fix + MockAuth Cleanup

### Issue Analysis

1. **Scrolling Banner**: The code in `HeaderNavBar.tsx` already has the correct 5 messages. The preview isn't loading due to the `useMockAuth` crash. Once that's fixed, the banner will show correctly.

2. **Preview Crash Root Cause**: `MockAuthContext.tsx` still exists. While `CartContext.tsx` was fixed to use `useAuth`, the file itself remains and could be imported elsewhere. Need to delete it entirely.

3. **Checkout Flow**: Currently insecure — creates Razorpay checkout directly from frontend without server-side order creation or signature verification. The `import Razorpay from 'razorpay'` on line 21 is a Node.js SDK being imported in the browser (will fail). The `verifyPayment` function exists but is never called. `handleRazorpayPayment` bypasses verification entirely.

### Changes

#### Task 1: Delete MockAuthContext (fix crash)
- **Delete** `frontend/src/contexts/MockAuthContext.tsx` — no other file imports from it anymore.

#### Task 2: Fix Checkout.tsx — Remove broken import
- Remove `import Razorpay from 'razorpay'` (line 21) — this is a Node.js package, not usable in browser.

#### Task 3: Rebuild Secure Payment Flow in Checkout.tsx

Replace `handleRazorpayPayment` with a secure flow:

1. Call edge function `create-razorpay-order` to create order server-side (validates amount, returns `razorpay_order_id`)
2. Open Razorpay checkout with the returned `order_id`
3. On payment success handler, call `verify-razorpay-payment` edge function
4. Only on verified success, call `createOrderAfterPayment` (which already handles order creation, inventory deduction, email, Delhivery)
5. On failure, show error and keep cart intact

The Razorpay script should be loaded once in `index.html` or loaded lazily, not re-appended on every click.

#### Task 4: Update `create-razorpay-order` Edge Function

Current edge function is mostly correct but needs:
- Server-side amount calculation by fetching cart items from DB (never trust frontend amount)
- Return `key_id` in response so frontend doesn't need env var
- Add idempotency check

#### Task 5: Update `verify-razorpay-payment` Edge Function

Current function verifies signature correctly but only updates an existing order. Need to restructure:
- After signature verification, create the order in DB (not before)
- Deduct inventory via DB
- Trigger Delhivery shipment via `create-delhivery-shipment` edge function
- Return order details to frontend
- Add idempotency: check if `razorpay_payment_id` already exists in orders table

#### Task 6: Update `create-delhivery-shipment` Edge Function

Already exists and is functional. Will be called from `verify-razorpay-payment` after order creation. Ensure `DELHIVERY_API_KEY` secret is set.

#### Task 7: Remove client-side Delhivery calls

Remove `import { delhiveryService }` from Checkout.tsx — all Delhivery calls should happen server-side only (API key must not be exposed in frontend). Delete or deprecate `frontend/src/services/delhivery.ts` since it contains the API key in plaintext.

#### Task 8: Update `supabase/config.toml`

Add JWT verification settings for the edge functions:
```toml
[functions.create-razorpay-order]
verify_jwt = false

[functions.verify-razorpay-payment]
verify_jwt = false

[functions.create-delhivery-shipment]
verify_jwt = false
```

### Architecture Flow

```text
User clicks "Pay" 
  → Frontend calls create-razorpay-order (with auth token)
  → Edge fn validates user, calculates amount from DB, creates Razorpay order
  → Returns order_id + amount + key_id
  → Frontend opens Razorpay checkout
  → Payment completes
  → Frontend sends payment_id + order_id + signature to verify-razorpay-payment
  → Edge fn verifies HMAC signature
  → Creates order in DB
  → Deducts inventory
  → Calls create-delhivery-shipment
  → Returns order details
  → Frontend shows success, clears cart, navigates to order page
```

### Files Modified
- `frontend/src/contexts/MockAuthContext.tsx` — **DELETE**
- `frontend/src/services/delhivery.ts` — **DELETE** (API key exposed in frontend)
- `frontend/src/pages/Checkout.tsx` — Rewrite payment flow (secure)
- `frontend/supabase/functions/create-razorpay-order/index.ts` — Server-side cart validation + amount calc
- `frontend/supabase/functions/verify-razorpay-payment/index.ts` — Order creation + inventory + Delhivery trigger
- `frontend/supabase/config.toml` — Add function configs
- `frontend/index.html` — Add Razorpay script tag

### Security Checklist
- Razorpay secret: server-side only (edge functions)
- Delhivery token: server-side only (edge functions)
- Amount validation: server-side from DB
- Signature verification: HMAC SHA256 server-side
- Auth required: all edge functions check JWT
- Idempotency: check existing payment_id before creating order
- No exposed API keys in frontend code

