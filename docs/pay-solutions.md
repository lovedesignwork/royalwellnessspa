# Pay Solutions checkout

## Hosted API migration status

The spa-specific URL migration is prepared locally. It must not replace the live checkout until the merchant's Terminal ID and key version are supplied, configured and tested. Production still uses the previously deployed legacy form flow until that release. The hotel defaults must be restored as a coordinated cutover after verification.

The new checkout calls `POST https://apis.paysolutions.asia/payment/gateway/v2/ui-payments` from the server and redirects the customer to the returned official provider URL. It sends both spa URLs explicitly for every payment:

- `returnUrl`: `https://www.royalwellnessspaphuket.com/payment/result?gateway=paysolutions&refno=<payment reference>`
- `postbackUrl`: `https://www.royalwellnessspaphuket.com/api/payment/paysolutions/callback?refno=<payment reference>`

Dynamic postbacks use GET with no body, so the reference is included in the URL. The existing callback already supports GET and independently verifies the payment through the Inquiry API. No hotel callback is forwarded or modified. Upstream failures never fall back to the merchant's default URLs.

## Configuration

Configure the existing Vercel `royalwellnessspa` production project:

- `PAYSOLUTIONS_MERCHANT_ID`: existing eight-digit merchant account
- `PAYSOLUTIONS_API_KEY` and `PAYSOLUTIONS_SECRET_KEY`: existing merchant credentials for inquiry and request-cookie signing; used for hosted API authentication unless the terminal has a separate credential pair
- `PAYSOLUTIONS_TERMINAL_ID`: required eight-character Terminal ID from the merchant control panel; never guess this from the merchant ID
- `PAYSOLUTIONS_KEY_VERSION`: required numeric key version associated with the configured terminal/API credentials
- `PAYSOLUTIONS_V2_API_KEY` and `PAYSOLUTIONS_V2_SECRET_KEY`: optional separate terminal credentials, if provided by Pay Solutions; configure both together
- `RPCH_SUPABASE_SERVICE_ROLE_KEY`: existing server-only booking database access
- `PAYSOLUTIONS_ENABLED`: existing checkout availability switch

Secrets belong in Vercel and local ignored environment files, never in source control or browser code. The app fails closed if hosted configuration is missing or the provider rejects the request.

## Coordinated hotel/spa cutover

1. Obtain the Terminal ID and key version and confirm the existing merchant credentials work for the hosted API. Do not rotate or regenerate the hotel's existing credentials.
2. Verify that Pay Solutions accepts a no-charge checkout initialization with both explicit spa URLs and returns its hosted payment page. A test session is not proof that a settled payment/callback works.
3. Deploy through GitHub `main` and verify the exact production commit and live flow.
4. Only then restore the merchant Control Panel defaults to the original hotel settings supplied by the owner:
   - Return URL: `https://www.royalphuketcity.com`
   - Postback URL: `https://www.myxcaliber.com/frontend/payment/pay-solutions-feed.html`
   - Keep the hotel's required parameter/delivery settings as confirmed by MyXcaliber.
5. Review any still-open spa checkout links created by the old default-based flow. They do not automatically acquire the new explicit URLs. Coordinate their expiry/replacement before relying on the hotel defaults for all outstanding sessions.
6. Reconcile hotel payments received while the shared defaults pointed at the spa with MyXcaliber. Restoring the URL alone does not prove earlier hotel bookings were confirmed.

The supplied screenshot establishes that both businesses use the same merchant account. It does not establish that existing hotel payment confirmations were unaffected. The current merchant dashboard requires sign-in, so the Terminal ID was not retrievable through the available session.

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

## LINE booking alerts

Royal Wellness reservation alerts are queued only on a transition to `payment_status = 'paid'` (or an already-paid insert). Pending, failed, cancelled and pay-at-spa checkout attempts do not queue booking alerts. The successful-payment snapshot is captured after the update. Repeated callbacks or later edits do not duplicate the notification.

The shared Supabase trigger retains other brands' and contact forms' existing behavior. Paid spa events use the request key `<reservation UUID>:paid`, giving them their own outbox record and LINE retry key while preserving any legacy sent creation alert. Old unsent unpaid spa creation alerts are moved to `needs_attention` with `ignored-unpaid-spa-reservation`; they must not be manually retried as payment confirmations. Existing alerts already sent to LINE cannot be recalled by this change. No historical paid events are backfilled automatically.

Migration: `supabase/migrations/20261118111228_spa_line_paid_only.sql`. Run `supabase/tests/spa_line_paid_only.sql` with `supabase db query --file` to verify the trigger behavior; it rolls back all fixtures so no test notification can be picked up by the worker.

Booking team notifications now go to five recipients: reservation, sales, marketing, puttipop.l and gm at royalphuketcity.com. The owner requested removal of wallop.c from booking notifications after the live test identified its prior bounce suppression. Its suppression is retained. Contact-form recipients are separate. A signed POST on the private test endpoint can retry only the team message for an already-paid THB10 test; a revised deterministic idempotency key prevents duplicate retries and the guest is not emailed again.
