"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const photos = [
  ["/fletcher/gallery-01.jpg", "Fine-line botanical and frog tattoo by Fletcher Tattoos"],
  ["/fletcher/gallery-02.jpg", "Realistic paw-print tattoo by Fletcher Tattoos"],
  ["/fletcher/gallery-03.jpg", "Black and grey portrait tattoo by Fletcher Tattoos"],
  ["/fletcher/gallery-04.jpg", "Dotwork eye and hands tattoo by Fletcher Tattoos"],
  ["/fletcher/gallery-05.jpg", "Fine-line lizard tattoo by Fletcher Tattoos"],
  ["/fletcher/gallery-06.jpg", "Colour horror portrait tattoo by Fletcher Tattoos"],
] as const;
const pages = ["Artist", "Style", "Links", "FAQ", "Booking"] as const;
type Page = typeof pages[number];
const MAX_REFERENCE_FILES = 4;
const MAX_REFERENCE_FILE_BYTES = 5 * 1024 * 1024;
const MAX_REFERENCE_TOTAL_BYTES = 12 * 1024 * 1024;

function Photo({ index, className = "" }: { index: number; className?: string }) {
  return <figure className={`fixed-book-photo ${className}`}><img src={photos[index][0]} alt={photos[index][1]} /><figcaption>Abbie’s work</figcaption></figure>;
}

function AboutPhoto({ src, alt, className }: { src: string; alt: string; className: string }) {
  return <figure className={`fixed-book-photo fixed-about-photo ${className}`}><img src={src} alt={alt} /><figcaption>Abbie at work</figcaption></figure>;
}

const VERIFIED_REVIEWS = [
  "I’ve had five tattoos with Abbie now, and I wouldn’t go anywhere else. She’s an incredible artist and a lovely person.",
  "Not only is Abbie a tremendous artist, she is also a genuinely nice person and very easy to talk to. I’ve had more than ten pieces from Abbie and I’m over the moon with all of them. I always feel comfortable in Abbie’s chair and would 100% recommend her.",
  "I’ve had lots of tattoos by Abbie. She is an amazing artist and always goes above and beyond to make sure you get the tattoo you want. She always makes you feel at ease and comfortable. I would highly recommend Fletcher Tattoos every time.",
  "Absolutely wonderful artist! I’ve been tattooed by Abbie a fair few times, and I love every tattoo she’s done — and get many compliments on them too. She’s professional and friendly and has always made me feel safe. I would highly recommend Fletcher Tattoos.",
] as const;

function ReviewNote({ number, className = "" }: { number: number; className?: string }) {
  return <aside className={`fixed-scrap-note has-review ${className}`} aria-label={`Anonymous client review ${number}`}><i aria-hidden="true" /><strong className="review-title">Reviews by you</strong><span className="review-copy">“{VERIFIED_REVIEWS[number - 1]}”</span></aside>;
}

function PageContents({ page, onBookingOpen }: { page: Page; onBookingOpen?: () => void }) {
  return <>
    <div className="fixed-book-folio">0{pages.indexOf(page) + 1} / {page}</div>
    {page === "Artist" && <><div className="fixed-book-artist-copy"><p className="fixed-book-kicker">About me · Abbie Fletcher</p><h1>Portraits<br /><em>to tattooing.</em></h1><p>I’m Abbie, a 28-year-old tattoo artist based in Shrewsbury, and I’ve been tattooing for seven years. My love of art began when I was very young, especially drawing portraits in pencil.</p></div><div className="artist-secondary-copy"><span>02 · Art &amp; direction</span><p>I went on to study Art &amp; Design for two years, learning about different artists and media while discovering the direction that interested me most.</p><div className="fixed-book-signature">Abbie Fletcher <span>Tattoo artist</span></div></div><AboutPhoto src="/fletcher/about/abbie-about-02.jpg" alt="Abbie Fletcher tattooing a client" className="about-photo-two" /><AboutPhoto src="/fletcher/about/abbie-about-03.jpg" alt="Abbie Fletcher working on a tattoo" className="about-photo-three" /></>}
    {page === "Style" && <><div className="fixed-style-heading"><p className="fixed-book-kicker">A practice in detail</p><h1>One Hand,<br /><em>Many Marks</em></h1><p className="fixed-style-intro">Listed below are the styles Abbie offers.</p></div><div className="fixed-style-list"><span>Realism &amp; Portraiture</span><span>Dotwork</span><span>Fine Line</span><span>Blackwork</span><span>Selective Colour</span></div><Photo index={1} className="style-photo-top" /><Photo index={4} className="style-photo-edge" /></>}
    {page === "Links" && <><div className="fixed-links-copy"><p className="fixed-book-kicker">Follow the work</p><h1>Find the<br /><em>studio.</em></h1><nav aria-label="Fletcher Tattoos social media"><a href="https://www.instagram.com/fletcher_tattoos/" target="_blank" rel="noreferrer"><span>01</span>Instagram</a><a href="https://www.tiktok.com/@fletchertattoos1" target="_blank" rel="noreferrer"><span>02</span>TikTok</a><a href="https://www.facebook.com/profile.php?id=61593254245531" target="_blank" rel="noreferrer"><span>03</span>Facebook</a></nav></div><ReviewNote number={1} className="links-review-one" /><ReviewNote number={2} className="links-review-two" /></>}
    {page === "FAQ" && <><div className="fixed-book-page-title"><p className="fixed-book-kicker">Before we begin</p><h1>Questions,<br /><em>in pencil.</em></h1></div><div className="fixed-book-faq"><details name="tattoo-faq"><summary>How do I start an enquiry?</summary><p>Share your idea, placement and reference images through the booking page. It starts a conversation, not a confirmed appointment.</p></details><details name="tattoo-faq"><summary>What should I include?</summary><p>The subject, style, approximate size, placement and useful visual references.</p></details><details name="tattoo-faq"><summary>When can I choose a date?</summary><p>Dates become available after your quote is accepted and your deposit has been paid.</p></details><details name="tattoo-faq" open><summary>How are price and timing agreed?</summary><p>Abbie reviews the enquiry before preparing an estimate.</p></details><ReviewNote number={3} className="faq-inline-review" /></div><Photo index={0} className="faq-photo-tucked" /></>}
    {page === "Booking" && <><div className="fixed-book-booking-copy"><p className="fixed-book-kicker">Your idea starts here</p><h1>Turn the page.<br /><em>Start the piece.</em></h1><p>Share your idea, placement and visual references in the local enquiry experience. It is a test workflow only: no real email, payment or booking is sent.</p><div><button type="button" tabIndex={onBookingOpen ? 0 : -1} onClick={onBookingOpen}>Start an enquiry</button></div></div><div className="fixed-book-checklist"><p>Bring to the conversation</p><ol><li><span>01</span>Your idea</li><li><span>02</span>Placement</li><li><span>03</span>Approximate scale</li><li><span>04</span>Visual references</li></ol></div><ReviewNote number={4} className="booking-review-low" /></>}
  </>;
}

type IntroPhase = "active" | "revealing" | "done" | "skipped";

function FletcherBookIntro({ onPhase }: { onPhase: (phase: IntroPhase) => void }) {
  const wipeFrameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [tracing, setTracing] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (window.sessionStorage.getItem("fletcher-book-intro-seen") === "1") {
        setVisible(false);
        onPhase("skipped");
        return;
      }
    } catch {}
    const traceTimer = window.setTimeout(() => setTracing(true), reducedMotion ? 20 : 260);
    const revealTimer = window.setTimeout(() => { setLeaving(true); onPhase("revealing"); }, reducedMotion ? 120 : 4550);
    const finishTimer = window.setTimeout(() => {
      try { window.sessionStorage.setItem("fletcher-book-intro-seen", "1"); } catch {}
      setVisible(false);
      onPhase("done");
    }, reducedMotion ? 240 : 5250);
    return () => { window.clearTimeout(traceTimer); window.clearTimeout(revealTimer); window.clearTimeout(finishTimer); };
  }, [onPhase]);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    let animationFrame = 0;
    const alignWipeToCover = () => {
      const frame = wipeFrameRef.current;
      const cover = document.querySelector<HTMLElement>(".fixed-book-front-cover");
      if (!frame || !cover) return;
      const bounds = cover.getBoundingClientRect();
      const coverStyle = window.getComputedStyle(cover);
      frame.style.left = `${bounds.left}px`;
      frame.style.top = `${bounds.top}px`;
      frame.style.width = `${bounds.width}px`;
      frame.style.height = `${bounds.height}px`;
      frame.style.borderRadius = coverStyle.borderRadius;
      frame.dataset.aligned = "true";
    };
    alignWipeToCover();
    animationFrame = window.requestAnimationFrame(alignWipeToCover);
    window.addEventListener("resize", alignWipeToCover);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", alignWipeToCover);
    };
  }, [visible]);

  if (!visible) return null;
  return <div className={`fx-loader book-intro-loader ${tracing ? "is-tracing" : ""} ${leaving ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label={tracing ? "Wiping cleansing foam to reveal Fletcher Tattoos before opening the artist book" : "Preparing the Fletcher Tattoos artist book"}>
    <div ref={wipeFrameRef} className="book-intro-cover-wipe" aria-hidden="true">
      <div className="book-intro-surface"><i /><i /><i /><i /></div>
      <img className="fx-wipe-hand-photo book-intro-hand" src="/fletcher/black-glove-cloth.png" alt="" />
    </div>
    <span className="book-intro-a11y">The Fletcher Tattoos artist book will be ready shortly.</span>
  </div>;
}

function BookingEnquiryModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<Array<{ file: File; url: string }>>([]);
  const [fileError, setFileError] = useState("");
  const [submission, setSubmission] = useState<{ state: "idle" | "sending" | "success" | "error"; message: string }>({ state: "idle", message: "" });
  const objectUrls = useRef(new Set<string>());
  const openedAt = useRef(Date.now());

  useEffect(() => () => { objectUrls.current.forEach(URL.revokeObjectURL); objectUrls.current.clear(); }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []);
    let totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);
    const allowed = incoming.filter((file) => {
      const valid = /^image\/(jpeg|png|webp|gif)$/i.test(file.type) && file.size <= MAX_REFERENCE_FILE_BYTES && files.length < MAX_REFERENCE_FILES && totalBytes + file.size <= MAX_REFERENCE_TOTAL_BYTES;
      if (valid) totalBytes += file.size;
      return valid;
    }).slice(0, Math.max(0, MAX_REFERENCE_FILES - files.length));
    const selected = allowed.map((file) => { const url = URL.createObjectURL(file); objectUrls.current.add(url); return { file, url }; });
    setFiles((current) => [...current, ...selected]);
    setFileError(allowed.length === incoming.length ? "" : "Add up to four JPG, PNG, WebP or GIF images, 5 MB each and 12 MB total.");
    setSubmission({ state: "idle", message: "" });
    event.target.value = "";
  }

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!files.length) { setFileError("Please add at least one reference image."); return; }
    setSubmission({ state: "sending", message: "" });
    const data = new FormData(form);
    data.set("openedAt", String(openedAt.current));
    files.forEach(({ file }) => data.append("references", file, file.name));
    try {
      const response = await fetch("/api/tattoo-enquiry", { method: "POST", body: data, headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || "The enquiry could not be sent. Please try again later.");
      files.forEach(({ url }) => { URL.revokeObjectURL(url); objectUrls.current.delete(url); });
      setFiles([]);
      form.reset();
      setSubmission({ state: "success", message: "Enquiry sent successfully." });
    } catch (error) {
      setSubmission({ state: "error", message: error instanceof Error ? error.message : "The enquiry could not be sent. Please try again later." });
    }
  }

  return <div className="booking-paper-overlay" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className="booking-paper-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-paper-title" aria-describedby="booking-paper-intro">
      <span className="booking-paper-crease crease-one" aria-hidden="true" /><span className="booking-paper-crease crease-two" aria-hidden="true" />
      <button ref={closeRef} className="booking-paper-close" type="button" onClick={onClose} aria-label="Close booking enquiry">Close <span aria-hidden="true">×</span></button>
      <header><h2 id="booking-paper-title">Tell me about<br /><em>your idea.</em></h2><p id="booking-paper-intro">A few thoughtful details help shape the first conversation.</p></header>
      <form className="booking-paper-form" onSubmit={sendEnquiry}>
        <label className="booking-paper-trap" aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label className="booking-paper-wide">Tattoo brief<textarea name="brief" required minLength={20} rows={4} placeholder="Subject, style, size and the feeling you want the piece to have…" /></label>
        <label className="booking-paper-wide">Placement<input name="placement" required placeholder="For example: inner forearm" /></label>
        <fieldset className="booking-paper-upload booking-paper-wide" aria-describedby="booking-upload-help booking-upload-error">
          <legend>Reference images</legend>
          <label><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={chooseFiles} /><span>Add reference images</span><small id="booking-upload-help">JPG, PNG, WebP or GIF · up to 4 files · 5 MB each</small></label>
          {fileError && <p id="booking-upload-error" role="alert">{fileError}</p>}
          {!!files.length && <ul className="booking-paper-previews" aria-label="Selected reference images">{files.map(({ file, url }, index) => <li key={`${file.name}-${file.lastModified}-${index}`}><img src={url} alt="" /><span title={file.name}>{file.name}</span><button type="button" onClick={() => setFiles((current) => current.filter((item, itemIndex) => { if (itemIndex === index) { URL.revokeObjectURL(item.url); objectUrls.current.delete(item.url); return false; } return true; }))} aria-label={`Remove ${file.name}`}>×</button></li>)}</ul>}
        </fieldset>
        <div className="booking-paper-finish booking-paper-wide"><button type="submit" disabled={submission.state === "sending"}>{submission.state === "sending" ? "Sending…" : "Send enquiry"}</button>{submission.message && <strong className={submission.state === "error" ? "is-error" : ""} role="status">{submission.message}</strong>}</div>
      </form>
    </div>
  </div>;
}

export default function BookExperience() {
  const [page, setPage] = useState<Page>("Artist");
  const [isOpen, setIsOpen] = useState(false);
  const [outgoingPage, setOutgoingPage] = useState<Page | null>(null);
  const [turnDirection, setTurnDirection] = useState<"forward" | "backward">("forward");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("active");
  const bookingTriggerRef = useRef<HTMLElement | null>(null);

  const openBooking = useCallback(() => {
    bookingTriggerRef.current = document.activeElement as HTMLElement;
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    window.requestAnimationFrame(() => bookingTriggerRef.current?.focus());
  }, []);

  function selectPage(nextPage: Page) {
    if (!isOpen || outgoingPage || nextPage === page) return;
    setTurnDirection(pages.indexOf(nextPage) > pages.indexOf(page) ? "forward" : "backward");
    setOutgoingPage(page);
    setPage(nextPage);
    window.setTimeout(() => setOutgoingPage(null), 1080);
  }

  return <main className={`fixed-book-site book-intro-host is-intro-${introPhase}`}>
    <div className="fixed-book-shadow" aria-hidden="true" />
    <article className={`fixed-book ${isOpen ? "is-open" : "is-closed"}`} aria-label="Fletcher Tattoos interactive artist book" aria-hidden={isBookingOpen || undefined} inert={isBookingOpen || undefined}>
      <div className="fixed-book-cover-edge" aria-hidden="true" /><div className="fixed-book-leaves" aria-hidden="true" /><div className="fixed-book-spine" aria-hidden="true" />
      <button className="fixed-book-front-cover" type="button" onClick={() => setIsOpen(true)} aria-label="Open the Fletcher Tattoos artist book" aria-expanded={isOpen}><span className="fixed-cover-volume">Artist’s book · Volume I</span><picture className="fixed-cover-logo"><source media="(max-width: 600px)" srcSet="/fletcher-tattoos-logo-transparent.png" /><img src="/fletcher-tattoos-logo.png" alt="Fletcher Tattoos" /></picture><span className="fixed-cover-rule" aria-hidden="true" /><strong>Open the book</strong><span className="fixed-cover-studio">The Needle Lounge · Shrewsbury</span></button>
      <header className="fixed-book-header"><div><strong>Fletcher</strong><em>Tattoos</em></div><p>The Needle Lounge<br /><span>19 Mardol · Shrewsbury · SY1 1PU</span></p></header>
      <nav className="fixed-book-tabs" aria-label="Artist book pages">{pages.map((item, index) => <button key={item} type="button" disabled={!!outgoingPage || !isOpen} className={page === item ? "is-active" : ""} onClick={() => selectPage(item)} aria-current={page === item ? "page" : undefined}><span>0{index + 1}</span>{item}</button>)}</nav>

      <section className={`fixed-book-page fixed-book-page-base page-${page.toLowerCase()}`} aria-live="polite"><PageContents page={page} onBookingOpen={openBooking} /></section>
      {outgoingPage && <>
        <section className={`fixed-book-page fixed-book-stationary-half is-${turnDirection} page-${outgoingPage.toLowerCase()}`} aria-hidden="true"><PageContents page={outgoingPage} /></section>
        <div className={`fixed-book-leaf-turn is-${turnDirection}`} aria-hidden="true">
          <div className="fixed-book-leaf-face fixed-book-leaf-front"><section className={`fixed-book-page fixed-book-leaf-content page-${outgoingPage.toLowerCase()}`}><PageContents page={outgoingPage} /></section></div>
          <div className="fixed-book-leaf-face fixed-book-leaf-back"><section className={`fixed-book-page fixed-book-leaf-back-content page-${page.toLowerCase()}`}><PageContents page={page} /></section><span aria-hidden="true" /></div>
        </div>
      </>}

      <footer className="fixed-book-footer"><span>Artist’s book · Volume I</span><span>Drawn to last · Made to belong</span></footer>
    </article>
    <FletcherBookIntro onPhase={setIntroPhase} />
    {isBookingOpen && <BookingEnquiryModal onClose={closeBooking} />}
  </main>;
}
