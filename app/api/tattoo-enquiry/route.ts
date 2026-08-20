import { Buffer } from "node:buffer";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 3;
const MAX_BODY_BYTES = 14 * 1024 * 1024;
const MAX_FILES = 4;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 12 * 1024 * 1024;
const attempts = new Map<string, number[]>();
const APPS_SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbwbLiyJE3tDQMPgUcM5M5VOaaSpdxW2yglxDO_J33gw2T7pk81BW1EHP-mspVpritVqJw/exec";

type EnquiryReference = { filename: string; content: string };

function json(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ message }, { status, headers });
}

function clientKey(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 1_000) {
    for (const [entry, times] of attempts) if (!times.some((time) => now - time < WINDOW_MS)) attempts.delete(entry);
  }
  return false;
}

function textField(data: FormData, name: string, min: number, max: number) {
  const value = data.get(name);
  if (typeof value !== "string") return null;
  const clean = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length >= min && clean.length <= max ? clean : null;
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function recognisedImage(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = String.fromCharCode(...bytes);
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (file.type === "image/webp") return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
  if (file.type === "image/gif") return ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
  return false;
}

function safeFilename(name: string, index: number) {
  const clean = name.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-100);
  return clean || `reference-${index + 1}`;
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const accepted = new Set([new URL(request.url).origin]);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (host) {
    for (const protocol of new Set([forwardedProto, "https", "http"])) {
      if (protocol === "https" || protocol === "http") accepted.add(`${protocol}://${host}`);
    }
  }
  return accepted.has(origin);
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return json("This request could not be verified.", 403);
  if (rateLimited(clientKey(request))) return json("Too many enquiry attempts. Please wait before trying again.", 429, { "Retry-After": "900" });

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return json("The selected images are too large.", 413);

  const appsScriptSecret = process.env.AFTATTOOS_APPS_SCRIPT_SECRET;
  if (!appsScriptSecret) return json("Online enquiry delivery is not available yet.", 503);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json("The enquiry form could not be read.", 400);
  }

  if (String(data.get("website") || "").trim()) return json("The enquiry could not be accepted.", 400);
  const openedAt = Number(data.get("openedAt"));
  if (!Number.isFinite(openedAt) || Date.now() - openedAt < 2_500 || Date.now() - openedAt > 24 * 60 * 60 * 1000) return json("Please reopen the enquiry form and try again.", 400);

  const name = textField(data, "name", 2, 100);
  const email = textField(data, "email", 5, 254);
  const brief = textField(data, "brief", 20, 4_000);
  const placement = textField(data, "placement", 2, 200);
  if (!name || !email || !validEmail(email) || !brief || !placement) return json("Please check the enquiry details and try again.", 400);

  const files = data.getAll("references").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length || files.length > MAX_FILES) return json("Please add between one and four reference images.", 400);
  if (files.some((file) => file.size > MAX_FILE_BYTES) || files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_FILE_BYTES) return json("The selected images exceed the upload limit.", 413);

  const references: EnquiryReference[] = [];
  for (const [index, file] of files.entries()) {
    if (!(await recognisedImage(file))) return json("One or more reference images are not a supported image file.", 400);
    references.push({ filename: safeFilename(file.name, index), content: Buffer.from(await file.arrayBuffer()).toString("base64") });
  }

  const text = [
    "New Fletcher Tattoos enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Placement: ${placement}`,
    "",
    "Tattoo brief:",
    brief,
    "",
    `${references.length} reference image${references.length === 1 ? "" : "s"} attached.`,
  ].join("\n");

  try {
    const response = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        secret: appsScriptSecret,
        name,
        email,
        brief,
        placement,
        subject: `New tattoo enquiry from ${name}`,
        text,
        references: references.map((reference, index) => ({ ...reference, type: files[index].type })),
      }),
    });
    if (!response.ok) {
      return json("The enquiry could not be delivered. Please try again later.", 502);
    }
    const result = await response.json().catch(() => null) as { ok?: boolean } | null;
    if (!result?.ok) return json("The enquiry service did not confirm delivery. Please try again later.", 502);
    return json("Enquiry sent successfully.", 200);
  } catch {
    return json("The enquiry service is temporarily unavailable. Please try again later.", 502);
  }
}
