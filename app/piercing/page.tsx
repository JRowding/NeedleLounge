import type { Metadata } from "next";
import { StudioFooter, StudioNav } from "../components";

export const metadata: Metadata = { title: "Piercing | The Needle Lounge", description: "Curated piercing, fine jewellery and a considered experience in Shrewsbury." };
export default function PiercingPage() {
  return (
    <main className="piercing-page" id="top">
      <StudioNav bookingSoon />
      <section className="service-hero piercing-hero shell">
        <div className="service-hero-copy"><p className="eyebrow"><span /> The Needle Lounge · Piercing</p><h1>Jewellery<br />for <em>you.</em></h1><p>Thoughtful placement, beautiful details and a calm, considered experience from hello to healed.</p><span className="primary-button coming-soon" aria-disabled="true">Online booking coming soon <span>◌</span></span></div>
        <div className="piercing-hero-art"><img src="/work/piercing-04.jpg" alt="Fine piercing jewellery selected by The Needle Lounge" /><span className="soft-orbit" /><p>Curated<br />with care</p></div>
      </section>
      <section className="service-strip"><div>EAR CURATION <i>✦</i> FACIAL PIERCING <i>✦</i> FINE JEWELLERY <i>✦</i> AFTERCARE <i>✦</i> EAR CURATION <i>✦</i> FACIAL PIERCING</div></section>
      <section className="intro-statement shell"><p className="section-no">01 / THE EXPERIENCE</p><h2>A little sparkle.<br />A lot of <em>you.</em></h2><div className="statement-copy"><p>Whether it’s your first piercing or the finishing touch to a curated ear, we take time over placement, proportions and the piece that feels right.</p><p>Welcoming. Unhurried. Always personal.</p></div></section>
      <section className="portfolio shell">
        <div className="portfolio-head"><p className="section-no">02 / RECENT WORK</p><h2>From the<br /><em>lounge.</em></h2></div>
        <div className="piercing-gallery">
          <figure className="gallery-a"><img src="/work/piercing-01.jpg" alt="Gold piercing jewellery styled with lace" /><figcaption>Fine details · Curated jewellery</figcaption></figure>
          <figure className="gallery-b"><img src="/work/piercing-02.jpg" alt="Piercing jewellery selection" /><figcaption>Made to layer</figcaption></figure>
          <figure className="gallery-c"><img src="/work/piercing-03.jpg" alt="Recent piercing work at The Needle Lounge" /><figcaption>Personal placement</figcaption></figure>
          <figure className="gallery-d"><img src="/work/piercing-04.jpg" alt="Fine jewellery from The Needle Lounge" /><figcaption>Wear it your way</figcaption></figure>
        </div>
      </section>
      <section className="service-list shell"><p className="section-no">03 / WHAT WE DO</p><div><p><span>01</span> Ear piercing &amp; curation <i>↗</i></p><p><span>02</span> Facial piercing <i>↗</i></p><p><span>03</span> Jewellery fitting <i>↗</i></p><p><span>04</span> Downsizing &amp; aftercare <i>↗</i></p></div></section>
      <section className="service-cta"><div className="shell"><p className="eyebrow"><span /> Ready when you are</p><h2>Find your<br /><em>next piece.</em></h2><span className="primary-button coming-soon" aria-disabled="true">Bookings opening soon <span>◌</span></span></div></section>
      <StudioFooter />
    </main>
  );
}
