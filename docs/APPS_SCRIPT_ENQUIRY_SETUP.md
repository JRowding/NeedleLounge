# Fletcher Tattoos enquiry relay

The tattoo form posts only to the same-origin server route at `/api/tattoo-enquiry`. That route validates the form, reference-image files and anti-spam checks before forwarding to the configured Google Apps Script endpoint. The endpoint URL, recipient and shared secret are never rendered in browser code.

## One Render setting

Create this private environment variable on the existing Render service, with a long random value:

```
AFTATTOOS_APPS_SCRIPT_SECRET=your-long-random-value
```

Set the identical value as the Apps Script project property named `INBOUND_SECRET`. Do not put it in client JavaScript, Git or a public script URL.

## Replace the Apps Script implementation

The current script accepts only text fields, so it cannot safely forward tattoo-reference images. Replace its `doPost` implementation with the following complete script, then redeploy the existing web app version. It sends to the intended private studio inbox within the script and returns a JSON confirmation that the website requires before showing success.

```javascript
const RECIPIENT = 'jon.rowding@gmail.com';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('INBOUND_SECRET');
    if (!expected || payload.secret !== expected) return reply({ ok: false, message: 'Unauthorised enquiry relay request.' });

    const required = ['name', 'email', 'brief', 'placement'];
    if (required.some((key) => typeof payload[key] !== 'string' || !payload[key].trim())) {
      return reply({ ok: false, message: 'Incomplete enquiry details.' });
    }

    const references = Array.isArray(payload.references) ? payload.references : [];
    if (!references.length || references.length > 4) return reply({ ok: false, message: 'Reference images are required.' });

    const attachments = references.map((reference, index) => {
      if (!reference || typeof reference.content !== 'string' || typeof reference.filename !== 'string' || typeof reference.type !== 'string') {
        throw new Error('Invalid reference image.');
      }
      return Utilities.newBlob(Utilities.base64Decode(reference.content), reference.type, reference.filename || `reference-${index + 1}`);
    });

    GmailApp.sendEmail(RECIPIENT, payload.subject || 'New Fletcher Tattoos enquiry', payload.text || '', {
      replyTo: payload.email,
      attachments,
      name: 'Fletcher Tattoos website',
    });
    return reply({ ok: true });
  } catch (error) {
    console.error(error);
    return reply({ ok: false, message: 'The studio relay could not process this enquiry.' });
  }
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```

In Apps Script: **Project Settings → Script properties → Add script property**, create `INBOUND_SECRET` with the same private value as Render. Then **Deploy → Manage deployments → Edit → New version → Deploy**. Keep the existing web-app URL.

The server additionally enforces same-origin requests, a honeypot, a minimum form-fill time, three attempts per IP per 15 minutes, strict text lengths, image MIME/signature checks, four files maximum, 5 MB per file and 12 MB total. Images are forwarded in memory and are not written to the website’s disk.
