# Fletcher Tattoos enquiry delivery with Resend

The public form posts only to the same-origin server route at `/api/tattoo-enquiry`. The Resend key and recipient are read from server environment variables and are never rendered into the browser bundle.

For the current test-only setup, configure one private variable on the existing Render service:

- `AFTATTOOS_API_KEY`: the Resend API key.

The server uses Resend's test sender, `Fletcher Tattoos <onboarding@resend.dev>`, and routes only to the intended test inbox held in server code. Neither value is rendered in browser code. Resend permits its `resend.dev` test sender to deliver only to the email address associated with that Resend account. If the account uses a different inbox, the form returns a clear actionable error rather than a false success.

Before accepting real customer enquiries, verify a Fletcher-controlled sender domain in Resend and replace the test-only sender/recipient constants with private deployment configuration.

Do not put real values in `.env.example`, client code, Git, screenshots or support messages. A Gmail password is not required.

The route enforces same-origin requests, a honeypot, a minimum form-fill time, three attempts per IP per 15 minutes, strict text lengths, image MIME/signature checks, four files maximum, 5 MB per file and 12 MB total. Images are attached directly to the Resend request in memory and are not written to disk or retained by this application.

## Public reference behaviour retained safely

The reference RSVP form uses required fields, a hidden honeypot, a disabled `Sending…` state and an inline success/error message. The Fletcher form keeps those useful interaction patterns. It intentionally does not copy the reference's public client-side `no-cors` delivery request, because that pattern cannot confirm whether the receiving service accepted the message. Fletcher enquiries instead use the same-origin server route above, and success is shown only after Resend returns a successful response.

The endpoint accepts `multipart/form-data` because tattoo reference images are part of the enquiry. Render proxy host/protocol headers are included in the same-origin check, while foreign origins remain rejected.
