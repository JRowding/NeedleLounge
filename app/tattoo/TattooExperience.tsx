"use client";

import { useEffect, useState } from "react";

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
          <div className="fx-hero-actions"><a href="#work">Explore work <span>↓</span></a><a href="#enquiries">Book &amp; enquiries <span>Coming soon</span></a></div>
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
        <h2>Your idea<br /><em>starts here.</em></h2><p>The online enquiry and booking experience is being prepared.</p><span className="fx-coming-soon">Coming soon</span>
        <div className="fx-socials" aria-label="Fletcher Tattoos social links"><a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={socials.tiktok} target="_blank" rel="noreferrer">TikTok</a><a href={socials.facebook} target="_blank" rel="noreferrer">Facebook</a></div>
      </section>

      <footer className="fx-footer"><a href="/">The Needle Lounge</a><span>19 Mardol · Shrewsbury · SY1 1PU</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
