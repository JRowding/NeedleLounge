# Gmail transactional email preparation

Email remains simulated unless all required server-side variables are configured. The current booking UI does not call the live adapter yet, so this preparation cannot send mail on its own.

1. Copy `.env.example` to `.env.local` for local testing. `.env.local` is ignored by Git.
2. Set `GMAIL_USER` to the dedicated Gmail address that will send booking messages.
3. Enable two-step verification on that Google account and create a Google **App Password**. Put the generated 16-character app password in `GMAIL_APP_PASSWORD`. Never use the account's normal Gmail password.
4. Set `BOOKING_BASE_URL` to the public HTTPS site origin when deployed, or `http://localhost:3000` locally.
5. Set `BOOKING_LINK_SECRET` to a long random server-side value. It signs customer-specific quote and decision links and must never be exposed to browser code.
6. During testing, optionally set `GMAIL_TEST_RECIPIENT` so every message is redirected to a controlled inbox instead of the customer's address.

The server-only adapter lives in `lib/booking-email.ts`. Without Gmail credentials and a link secret it returns a simulation result and keeps the existing local outbox behaviour. Future server actions can call `deliverBookingEmail()` only when Abby explicitly sends a prepared quote, then record a real delivery only when its result says `delivered: true`. Choosing accept or reject during internal triage must never call the adapter.
