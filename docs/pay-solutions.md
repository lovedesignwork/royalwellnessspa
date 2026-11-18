# Pay Solutions checkout

New spa checkout uses Pay Solutions' hosted payment page at `https://payments.paysolutions.asia/payment`. Card details stay on the provider page. The existing 2C2P signed callback is retained only for legacy bookings, with reference and amount checks; new bookings never request a 2C2P token.

## Configuration

Production secrets are in the existing Vercel `royalwellnessspa` project:

- `PAYSOLUTIONS_ENABLED`: keep `false` until dashboard URLs are configured and verified; set `true` and redeploy to open checkout
- `PAYSOLUTIONS_MERCHANT_ID`: eight-digit merchant account
- `PAYSOLUTIONS_API_KEY`: payment inquiry API key
- `PAYSOLUTIONS_SECRET_KEY`: merchant secret for authenticated inquiry
- `RPCH_SUPABASE_SERVICE_ROLE_KEY`: server-only access to the existing RPCH project

Never put these values in source control or client-side environment variables.

In Pay Solutions controls → Merchant Settings → Return Parameter, configure:

- Return URL (GET): `https://www.royalwellnessspaphuket.com/payment/result?gateway=paysolutions`
- Postback URL (POST): `https://www.royalwellnessspaphuket.com/api/payment/paysolutions/callback`
- Include the payment reference as `refno` in both returns and postbacks. The handler also accepts `ReferenceNo`.

The hosted Simple Payment documentation does not specify per-order callback URL overrides. These settings must be verified in the merchant dashboard; the API key does not grant dashboard access.

## Verification behavior

Prices and durations are checked against the server's treatment catalogue, including the existing 10% hotel-guest discount. Tampered totals are rejected. Each checkout receives a cryptographically random, unique 12-digit payment reference and a separate booking reference.

Callbacks and the return page trigger an authenticated request to the official Inquiry API. Payment is confirmed only when reference, merchant (full eight-digit ID or its authenticated inquiry five-digit representation), THB currency, exact amount and paid `Y` status from the live PromptPay inquiry (or completed `CP` from the documented legacy response) all match. Browser `result`, `apcode` and callback status values never authorize a payment. An empty inquiry remains pending rather than being treated as failure or success.

The status page requires an HttpOnly signed cookie set by checkout. Guests must use the same browser and canonical domain. Without the cookie, they should contact the spa with their provider receipt. Result pages do not expose reservation details to other visitors.

A conditional pending → paid database update ensures repeated callbacks/polls trigger the existing booking email workflow only on the first transition. Email delivery and a settled transaction still require real provider testing. A provider cancellation or an unverified payment remains pending; it is never confirmed from browser fields alone.

The migration removes public reservation reads and updates, restricts direct public inserts to unpaid inquiries, preserves allowlisted admin access and adds a unique index for new numeric payment references. Existing reservation data and 2C2P references are retained.

## Checks

Run `node --test tests/payment.test.cjs` for form serialization, secret exclusion, server pricing, signed cookies, exact payment matching, authenticated inquiry and idempotent confirmation tests. Run `npm run build` before deployment.

Browser verification covers treatment/date/time selection, guest details, the Pay Solutions POST handoff, correct amount, pending status, rejection of forged success callbacks and private status access. Local and live test bookings must be deleted afterward using their exact reference and the `royal-payment-verification@example.com` fixture email, only while unpaid. Never submit a card payment without explicit authorization.

Official references:

- https://api-docs.payso.co/docs/api/redirect/simple-payment
- https://api-docs.payso.co/docs/api/payment-features/inquiry-api/
- https://api-docs.payso.co/docs/api/preparation/

The owner confirmed the dashboard settings on 18 November 2026 and supplied a screenshot showing the canonical return and postback URLs, postbacks enabled, GET delivery and the required `refno` parameter. Both GET and POST callbacks are supported. Production `PAYSOLUTIONS_ENABLED` is enabled after this confirmation. A settled payment and actual provider-generated callback still require a real transaction; no charge is made during the activation checks.

## Authorized small live tests

`/api/payment/test` is a private checkout for a pre-created reservation whose service is exactly `SYSTEM PAYMENT TEST - NO SPA TREATMENT` and amount is exactly THB 10. It cannot create bookings or choose arbitrary amounts. A one-hour HMAC-signed link authorizes access, sets the normal result-page cookie, and posts to the same hosted payment flow. Invalid links and regular treatment bookings return 404. Paid links only reopen the result page. Do not publish these links or add them to navigation.

The owner authorized one THB 10 PromptPay test, including normal guest and team notifications. Test records must clearly state that they reserve no appointment. Keep a completed real payment as an audit record; do not delete it as an unpaid browser fixture. An actual refund requires a separate instruction.

Callbacks log their arrival and verified result using only the payment reference. Booking sends log Resend message IDs and report provider errors. Separate deterministic idempotency keys protect the team and guest messages against accidental duplicate requests within Resend's retention window. Resend delivery status verifies acceptance by recipient mail servers, not inbox placement or that a person read the message.

The first real PromptPay test returned `MerchantID: 36906`, `Status: Y`, `StatusName: Paid`. The verifier matches this authenticated response against the configured merchant suffix while retaining exact reference, amount and currency checks. Browser and callback status values remain untrusted.

Signed test links can inspect Resend delivery metadata using an email ID. The server uses the site account, validates that the message subject belongs to this test reference, and returns status only; message bodies and credentials are never returned. This supports checking the correct sending account when a connected Resend account differs.

The same signed test link supports read-only suppression diagnosis restricted to the configured team recipients. It cannot remove suppressions or send messages. Existing bounce, complaint or manual suppressions require investigation before any removal or resend.
