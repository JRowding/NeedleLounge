# Fletcher Tattoos enquiry delivery with Resend

The public form posts only to the same-origin server route at `/api/tattoo-enquiry`. The Resend key and recipient are read from server environment variables and are never rendered into the browser bundle.

Configure these private variables on the existing Render service:

- `AFTATTOOS_API_KEY`: the Resend API key.
- `AFTATTOOS_FROM`: a sender using a domain or address verified in Resend, for example `Fletcher Tattoos <enquiries@verified-domain.example>`.
- `AFTATTOOS_RECIPIENT`: the private studio/test recipient.
- `AFTATTOOS_DELIVERY_ENABLED`: leave as `false` until the sender is verified and the first live test is explicitly approved; then set it to `true`.
- `BOOKING_BASE_URL`: the public HTTPS origin, currently `https://needlelounge.onrender.com`.

Do not put real values in `.env.example`, client code, Git, screenshots or support messages. A Gmail password is not required.

The route enforces same-origin requests, a honeypot, a minimum form-fill time, three attempts per IP per 15 minutes, strict text lengths, image MIME/signature checks, four files maximum, 5 MB per file and 12 MB total. Images are attached directly to the Resend request in memory and are not written to disk or retained by this application.
