import type { Metadata } from "next";
import { Arrow, StudioFooter, StudioNav } from "../components";

export const metadata: Metadata = { title: "Fletcher Tattoos | The Needle Lounge", description: "Original tattoo work by Abbie Fletcher in Shrewsbury." };

export default function TattooPage() {
  return (
    <main className="tattoo-page" id="top">
      <StudioNav theme="dark" />
      <section className="service-hero tattoo-hero shell">
        <div className="service-hero-copy"><p className="eyebrow"><span /> Abbie Fletcher · Tattoo artist</p><p className="fletcher-logo">Fletcher <i>Tattoos</i></p><h1>Wear the<br /><em>story.</em></h1><p>Original tattoos drawn for the person wearing them — delicate, dark or somewhere beautifully in between.</p><a className="primary-button tattoo-button" href="#enquire">Start your idea <Arrow /></a></div>
        <div className="tattoo-hero-art"><img src="/work/tattoo-02.jpg" alt="Recent tattoo by Fletcher Tattoos" /><span className="red-target" /><span className="vertical-type">CUSTOM WORK · SHREWSBURY</span></div>
      </section>
      <section className="service-strip tattoo-strip"><div>CUSTOM WORK <i>✦</i> FLASH <i>✦</i> FINE LINE <i>✦</i> BLACKWORK <i>✦</i> CUSTOM WORK <i>✦</i> FLASH</div></section>
      <section className="tattoo-manifesto shell"><p className="section-no">01 / THE WORK</p><h2>Your skin.<br />My lines.<br /><em>Our idea.</em></h2><p>Every piece starts with a conversation. Bring the seed of an idea, a feeling or a reference — together, we’ll turn it into something that belongs nowhere else.</p></section>
      <section className="portfolio tattoo-portfolio shell">
        <div className="portfolio-head"><p className="section-no">02 / LATEST INK</p><h2>Made to<br /><em>last.</em></h2></div>
        <div className="tattoo-gallery">
          <figure><img src="/work/tattoo-01.jpg" alt="Recent custom tattoo by Abbie Fletcher" /><figcaption><span>01</span> Custom work</figcaption></figure>
          <figure><img src="/work/tattoo-02.jpg" alt="Tattoo detail by Fletcher Tattoos" /><figcaption><span>02</span> Fine detail</figcaption></figure>
          <figure><img src="/work/tattoo-03.jpg" alt="Finished tattoo by Fletcher Tattoos" /><figcaption><span>03</span> Original ink</figcaption></figure>
        </div>
      </section>
      <section className="tattoo-process shell"><p className="section-no">03 / HOW IT WORKS</p><div className="process-grid"><article><span>01</span><h3>Tell me</h3><p>Share your idea, placement and rough size.</p></article><article><span>02</span><h3>Shape it</h3><p>We refine the concept and make it yours.</p></article><article><span>03</span><h3>Ink it</h3><p>Arrive, settle in and make it permanent.</p></article></div></section>
      <section className="tattoo-enquire" id="enquire"><div className="shell"><p className="eyebrow"><span /> Tattoo bookings</p><h2>Got an<br /><em>idea?</em></h2><p>The SumUp booking link will live here. For now, this shows exactly where enquiries and deposits will slot into the finished site.</p><button className="primary-button tattoo-button" disabled>Booking link coming soon</button></div></section>
      <StudioFooter theme="dark" />
    </main>
  );
}
