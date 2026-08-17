"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

const portfolio = [
  { src: "/fletcher/gallery-01.jpg", alt: "Fine-line botanical and frog tattoo by Fletcher Tattoos", position: "center" },
  { src: "/fletcher/gallery-02.jpg", alt: "Realistic paw-print tattoo by Fletcher Tattoos", position: "center" },
  { src: "/fletcher/gallery-03.jpg", alt: "Black and grey portrait tattoo by Fletcher Tattoos", position: "center" },
  { src: "/fletcher/gallery-04.jpg", alt: "Dotwork eye and hands tattoo by Fletcher Tattoos", position: "center" },
  { src: "/fletcher/gallery-05.jpg", alt: "Fine-line lizard tattoo by Fletcher Tattoos", position: "center" },
  { src: "/fletcher/gallery-06.jpg", alt: "Colour horror portrait tattoo by Fletcher Tattoos", position: "center" },
];

const styles = [
  ["01", "Realism & portraiture", "Detailed work grounded in observation, likeness and careful tonal structure."],
  ["02", "Dotwork", "Texture, depth and soft gradients built one considered mark at a time."],
  ["03", "Fine line", "Delicate linework for botanical, ornamental and minimal ideas."],
  ["04", "Blackwork", "Confident black ink, graphic contrast and lasting silhouettes."],
  ["05", "Selected colour", "Colour used selectively where it serves the piece and the idea."],
];

const socials = {
  instagram: "https://www.instagram.com/fletcher_tattoos/",
  tiktok: "https://www.tiktok.com/@fletchertattoos1",
  facebook: "https://www.facebook.com/profile.php?id=61561303597287",
};

export default function TattooExperience() {
  const [showIndex, setShowIndex] = useState(0);
  const [showPaused, setShowPaused] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [loaderTracing, setLoaderTracing] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [referencePreviews, setReferencePreviews] = useState<Array<{ name: string; url: string }>>([]);
  const [uploadError, setUploadError] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const previewUrls = useRef<string[]>([]);

  function handleReferences(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = [];
    setDraftReady(false);
    if (!files.length) { setReferencePreviews([]); setUploadError("Please add at least one reference image."); return; }
    if (files.length > 6) { event.target.value = ""; setReferencePreviews([]); setUploadError("Choose up to six reference images."); return; }
    const invalid = files.find((file) => !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024);
    if (invalid) { event.target.value = ""; setReferencePreviews([]); setUploadError("Each file must be an image no larger than 8 MB."); return; }
    const previews = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    previewUrls.current = previews.map(({ url }) => url);
    setReferencePreviews(previews);
    setUploadError("");
  }

  function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!referencePreviews.length) { setUploadError("Please add at least one reference image."); return; }
    setDraftReady(true);
  }

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("fletcher-loader-seen") === "1") { setLoaderVisible(false); return; }
    } catch {}
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 120 : 850;
    const started = performance.now();
    let frame = 0;
    let traceTimer = 0;
    let finishTimer = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - started) / duration) * 100));
      setLoaderProgress(value);
      if (value < 100) { frame = window.requestAnimationFrame(tick); return; }
      setLoaderTracing(true);
      traceTimer = window.setTimeout(() => {
        setLoaderLeaving(true);
        try { window.sessionStorage.setItem("fletcher-loader-seen", "1"); } catch {}
        finishTimer = window.setTimeout(() => setLoaderVisible(false), reducedMotion ? 80 : 650);
      }, reducedMotion ? 80 : 5700);
    };
    frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(traceTimer); window.clearTimeout(finishTimer); };
  }, []);

  useEffect(() => {
    if (!loaderVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [loaderVisible]);

  useEffect(() => {
    if (showPaused) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => setShowIndex((value) => (value + 1) % portfolio.length), reducedMotion ? 6500 : 4200);
    return () => window.clearInterval(timer);
  }, [showPaused]);

  useEffect(() => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  return (
    <main className={`fx-page ${loaderVisible ? "fx-page-loading" : ""}`} id="top">
      {loaderVisible && <div className={`fx-loader ${loaderTracing ? "is-tracing" : ""} ${loaderLeaving ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label={loaderTracing ? "Wiping cleansing foam to reveal the Fletcher Tattoos logo" : "Preparing Fletcher Tattoos"}>
        <div className="fx-loader-grid" aria-hidden="true" />
        <div className="fx-wipe-canvas" aria-hidden="true">
          <div className="fx-wipe-stage">
            <img className="fx-wipe-logo" src="/fletcher-tattoos-logo.png" alt="" />
            <div className="fx-wipe-foam">
              <i /><i /><i /><i />
              <b /><b /><b /><b /><b /><b /><b /><b /><b /><b />
            </div>
            <span className="fx-wipe-sheen" />
          </div>
          <img className="fx-wipe-hand-photo" src="/fletcher/black-glove-cloth.png" alt="" />
        </div>
        <span className="fx-loader-progress-a11y" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loaderProgress} />
      </div>}
      <nav className="fx-nav" aria-label="Fletcher Tattoos navigation">
        <p className="fx-nav-studio"><strong>The Needle Lounge</strong><span>19 Mardol · Shrewsbury · SY1 1PU</span></p>
        <span className="fx-nav-balance" aria-hidden="true" />
        <div><a href="#work">Work</a><a href="#style">Style</a><a href="#about">About</a><a href="#enquiries">Enquiries</a></div>
      </nav>

      <header className="fx-hero">
        <div className="fx-hero-copy">
          <h1><span>Drawn</span><br /><em>to last.</em></h1>
          <p>Custom tattooing with a focus on considered line, texture and detail—now based at The Needle Lounge in Shrewsbury.</p>
          <div className="fx-hero-actions"><a href="#work">Explore work <span>↓</span></a><a href="#enquiries">Book &amp; enquiries <span>Start a draft</span></a></div>
        </div>
        <div className="fx-hero-art"><img src="/work/tattoo-03.jpg" alt="Fine-line floral work by Fletcher Tattoos" /><div className="fx-image-shade" /><img className="fx-hero-logo" src="/fletcher-tattoos-logo.png" alt="Fletcher Tattoos" /></div>
      </header>

      <section className="fx-ticker" aria-label="Tattoo styles"><div>REALISM &amp; PORTRAITURE <i>✦</i> DOTWORK <i>✦</i> FINE LINE <i>✦</i> BLACKWORK <i>✦</i> SELECTED COLOUR <i>✦</i> REALISM &amp; PORTRAITURE <i>✦</i> DOTWORK</div></section>

      <section className="fx-auto-gallery" id="work" aria-label="Selected tattoo work">
        <h2 className="fx-gallery-title"><span>Examples</span><em>Of My Work.</em></h2>
        <figure
          key={portfolio[showIndex].src}
          className="fx-auto-stage"
          tabIndex={0}
          aria-label={`Tattoo work ${showIndex + 1} of ${portfolio.length}`}
          onPointerEnter={() => setShowPaused(true)}
          onPointerLeave={() => setShowPaused(false)}
          onPointerDown={() => setShowPaused(true)}
          onPointerUp={() => setShowPaused(false)}
          onFocus={() => setShowPaused(true)}
          onBlur={() => setShowPaused(false)}
        >
          <img className="fx-auto-image" src={portfolio[showIndex].src} alt={portfolio[showIndex].alt} style={{ objectPosition: portfolio[showIndex].position }} />
          <span className="fx-auto-stencil" aria-hidden="true" />
          <span className="fx-auto-needle" aria-hidden="true"><i /></span>
        </figure>
      </section>

      <section className="fx-styles" id="style" aria-labelledby="style-title">
        <div className="fx-styles-heading"><h2 id="style-title">One hand.<br /><em>Many marks.</em></h2><p>Abbie’s publicly listed styles span five complementary approaches.</p></div>
        <div className="fx-style-list">{styles.map(([number, title, description]) => <article key={number} tabIndex={0}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="fx-about" id="about">
        <div className="fx-about-art"><img src="/work/tattoo-01.jpg" alt="Dotwork tattoo detail by Fletcher Tattoos" /><img className="fx-about-watermark" src="/fletcher-tattoos-logo.png" alt="Fletcher Tattoos" /></div>
        <div className="fx-about-copy"><h2>Art first.<br /><em>Always.</em></h2><p>Abbie’s route into tattooing began with drawing—especially pencil portraits—and continued through two years studying Art &amp; Design. That foundation now informs work ranging from realism and portraiture to fine line, dotwork and blackwork.</p><p>She is now based at <strong>The Needle Lounge</strong>, an independent body-art studio at 19 Mardol in Shrewsbury.</p><a href="#enquiries">Start your idea <span>↓</span></a></div>
      </section>

      <section className="fx-enquiries" id="enquiries">
        <div className="fx-enquiry-intro"><p className="fx-enquiry-kicker">Tattoo enquiry · Local prototype</p><h2>Your idea<br /><em>starts here.</em></h2><p>Share the shape of your idea and a few visual references. This prototype keeps everything on your device and does not send or store personal information.</p></div>
        <form className="fx-enquiry-form" onSubmit={handleEnquiry}>
          <div className="fx-form-field"><label htmlFor="enquiry-name">Your name</label><input id="enquiry-name" name="name" autoComplete="name" minLength={2} required placeholder="How should Abbie address you?" /></div>
          <div className="fx-form-field"><label htmlFor="enquiry-email">Email address</label><input id="enquiry-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
          <div className="fx-form-field fx-form-wide"><label htmlFor="enquiry-idea">Describe your tattoo idea</label><textarea id="enquiry-idea" name="idea" minLength={20} required rows={6} placeholder="Subject, style, approximate size, meaningful details and anything you definitely do—or don’t—want…" /><span>At least 20 characters gives enough detail for a useful first conversation.</span></div>
          <div className="fx-form-field fx-form-wide"><label htmlFor="enquiry-placement">Body part / placement</label><input id="enquiry-placement" name="placement" minLength={2} required placeholder="For example: outer forearm, left shoulder blade" /></div>
          <div className="fx-upload fx-form-wide">
            <label htmlFor="enquiry-references"><strong>Reference images</strong><span>Choose 1–6 images · 8 MB maximum each</span></label>
            <input id="enquiry-references" name="references" type="file" accept="image/*" multiple required onChange={handleReferences} aria-describedby="reference-guidance reference-error" />
            <p id="reference-guidance">JPG, PNG, WEBP and HEIC are welcome. Only choose images you are comfortable sharing during a future consultation; avoid files containing unrelated personal or sensitive information.</p>
            {uploadError && <p className="fx-form-error" id="reference-error" role="alert">{uploadError}</p>}
            {referencePreviews.length > 0 && <div className="fx-reference-grid" aria-label={`${referencePreviews.length} reference image previews`}>{referencePreviews.map((preview) => <figure key={preview.url}><img src={preview.url} alt={`Preview of ${preview.name}`} /><figcaption>{preview.name}</figcaption></figure>)}</div>}
          </div>
          <div className="fx-form-finish fx-form-wide"><button type="submit">Review my enquiry</button><a href="/tattoo/booking-demo">Open full booking demo</a><p>No data leaves this page. Live submission and booking confirmation will be added only when the secure booking connection is ready.</p></div>
          {draftReady && <div className="fx-draft-ready fx-form-wide" role="status"><strong>Your local draft is ready.</strong><span>Nothing has been sent or booked. This preview confirms the form is complete and ready for a future secure hand-off.</span></div>}
        </form>
        <div className="fx-socials" aria-label="Fletcher Tattoos social links"><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={socials.tiktok} target="_blank" rel="noreferrer">TikTok</a><a href={socials.facebook} target="_blank" rel="noreferrer">Facebook</a></div>
      </section>

      <footer className="fx-footer"><a href="/">The Needle Lounge</a><span>19 Mardol · Shrewsbury · SY1 1PU</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
