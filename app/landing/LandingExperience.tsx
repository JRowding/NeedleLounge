"use client";

import { useEffect, useRef, useState } from "react";

type Choice = "piercing" | "tattoo" | null;

export default function LandingExperience() {
  const [active, setActive] = useState<Choice>(null);
  const [mobileAutoplay, setMobileAutoplay] = useState(false);
  const piercingTheatre = useRef<HTMLDivElement>(null);
  const piercingFill = useRef<HTMLSpanElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const firstI = useRef<HTMLSpanElement>(null);
  const secondI = useRef<HTMLSpanElement>(null);
  const firstDot = useRef<HTMLElement>(null);
  const secondDot = useRef<HTMLElement>(null);
  const tattooTheatre = useRef<HTMLDivElement>(null);
  const tattooGhost = useRef<HTMLSpanElement>(null);
  const tattooMachine = useRef<HTMLSpanElement>(null);
  const tattooFinalFill = useRef<HTMLSpanElement>(null);
  const tattooDotFill = useRef<HTMLSpanElement>(null);
  const inkBands = useRef<Array<HTMLSpanElement | null>>([]);

  function cancelWithin(element: HTMLElement | null) {
    element?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  }

  function animatePiercing() {
    const stage = piercingTheatre.current;
    const tool = needle.current;
    const fill = piercingFill.current;
    if (!stage || !tool || !fill || !firstI.current || !secondI.current || !firstDot.current || !secondDot.current) return;
    cancelWithin(stage);
    const stageBox = stage.getBoundingClientRect();
    const target = (letter: HTMLElement) => {
      const box = letter.getBoundingClientRect();
      return { x: box.left + box.width / 2 - stageBox.left, y: box.top - stageBox.top - 3 };
    };
    const a = target(firstI.current);
    const b = target(secondI.current);
    const px = (value: number) => `${value}px`;

    fill.animate([{ opacity: 0, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 330, delay: 100, fill: "forwards", easing: "ease-out" });
    tool.animate([
      { offset: 0, left: px(-35), top: px(-55), opacity: 0, transform: "translate(-50%,-100%) rotate(25deg)" },
      { offset: .08, opacity: 1 },
      { offset: .27, left: px(a.x - 28), top: px(a.y - 42), transform: "translate(-50%,-100%) rotate(14deg)" },
      { offset: .36, left: px(a.x), top: px(a.y - 12), transform: "translate(-50%,-100%) rotate(3deg)" },
      { offset: .40, left: px(a.x), top: px(a.y + 1), transform: "translate(-50%,-100%) rotate(0deg)" },
      { offset: .45, left: px(a.x), top: px(a.y - 22), transform: "translate(-50%,-100%) rotate(-7deg)" },
      { offset: .55, left: px((a.x + b.x) / 2), top: px(Math.min(a.y, b.y) - 62), transform: "translate(-50%,-100%) rotate(19deg)" },
      { offset: .65, left: px(b.x - 18), top: px(b.y - 30), transform: "translate(-50%,-100%) rotate(11deg)" },
      { offset: .70, left: px(b.x), top: px(b.y - 11), transform: "translate(-50%,-100%) rotate(3deg)" },
      { offset: .74, left: px(b.x), top: px(b.y + 1), transform: "translate(-50%,-100%) rotate(0deg)" },
      { offset: .79, left: px(b.x), top: px(b.y - 22), transform: "translate(-50%,-100%) rotate(-8deg)" },
      { offset: .90, left: px(stageBox.width + 5), top: px(-22), opacity: 1, transform: "translate(-50%,-100%) rotate(22deg)" },
      { offset: 1, left: px(stageBox.width + 60), top: px(-65), opacity: 0, transform: "translate(-50%,-100%) rotate(28deg)" },
    ], { duration: 2350, fill: "forwards", easing: "cubic-bezier(.42,.02,.25,1)" });

    firstDot.current.animate([{ opacity: 0, transform: "translate(-50%,-90%) scale(0)" }, { opacity: 1, transform: "translate(-50%,-90%) scale(1.5)" }, { opacity: 1, transform: "translate(-50%,-90%) scale(1)" }], { duration: 190, delay: 900, fill: "forwards", easing: "ease-out" });
    secondDot.current.animate([{ opacity: 0, transform: "translate(-50%,-90%) scale(0)" }, { opacity: 1, transform: "translate(-50%,-90%) scale(1.5)" }, { opacity: 1, transform: "translate(-50%,-90%) scale(1)" }], { duration: 190, delay: 1375, fill: "forwards", easing: "ease-out" });
  }

  function animateTattoo() {
    const stage = tattooTheatre.current;
    const ghost = tattooGhost.current;
    const machine = tattooMachine.current;
    if (!stage || !ghost || !machine || !tattooFinalFill.current || !tattooDotFill.current) return;
    cancelWithin(stage);
    const stageBox = stage.getBoundingClientRect();
    const wordBox = ghost.getBoundingClientRect();
    const left = wordBox.left - stageBox.left;
    const right = wordBox.right - stageBox.left;
    const top = wordBox.top - stageBox.top;
    const height = wordBox.height;
    const y = [top + height * .15, top + height * .32, top + height * .49, top + height * .66, top + height * .83];
    const px = (value: number) => `${value}px`;

    const frames: Keyframe[] = [{ offset: 0, left: px(left - 35), top: px(y[0]), opacity: 0, transform: "translate(-70px,-112px) rotate(-12deg)" }];
    y.forEach((row, index) => {
      const start = index % 2 === 0 ? left : right;
      const end = index % 2 === 0 ? right : left;
      const segmentStart = .04 + index * .19;
      frames.push(
        { offset: segmentStart, left: px(start), top: px(row), opacity: 1, transform: `translate(-70px,-112px) rotate(${index % 2 === 0 ? -10 : -16}deg)` },
        { offset: segmentStart + .085, left: px((start + end) / 2), top: px(row + 4), opacity: 1, transform: `translate(-70px,-112px) rotate(${index % 2 === 0 ? -13 : -11}deg)` },
        { offset: segmentStart + .17, left: px(end), top: px(row), opacity: 1, transform: `translate(-70px,-112px) rotate(${index % 2 === 0 ? -9 : -15}deg)` },
      );
    });
    frames.push({ offset: 1, left: px(right + 55), top: px(y[4] - 45), opacity: 0, transform: "translate(-70px,-112px) rotate(-8deg)" });
    machine.animate(frames, { duration: 3000, fill: "forwards", easing: "linear" });

    inkBands.current.forEach((band, index) => {
      if (!band) return;
      const from = index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
      band.animate([{ clipPath: from }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, delay: 110 + index * 575, fill: "forwards", easing: "linear" });
    });
    tattooFinalFill.current.animate([{ offset: 0, opacity: 0 }, { offset: .84, opacity: 0 }, { offset: .87, opacity: 1 }, { offset: 1, opacity: 1 }], { duration: 3500, fill: "forwards", easing: "ease-out" });
    tattooDotFill.current.animate([{ offset: 0, opacity: 0, filter: "blur(2px)" }, { offset: .9, opacity: 0, filter: "blur(2px)" }, { offset: 1, opacity: .3, filter: "blur(0)" }], { duration: 3500, fill: "forwards", easing: "ease-out" });
  }

  function enter(choice: Exclude<Choice, null>) {
    setActive(choice);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 800px)").matches) return;
    requestAnimationFrame(choice === "piercing" ? animatePiercing : animateTattoo);
  }

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 800px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mobile || reducedMotion) return;

    let cancelled = false;
    let tattooTimer = 0;
    let finishTimer = 0;
    setMobileAutoplay(true);

    document.fonts.ready.then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        setActive("piercing");
        animatePiercing();
      });
      tattooTimer = window.setTimeout(() => {
        setActive("tattoo");
        animateTattoo();
      }, 2750);
      finishTimer = window.setTimeout(() => setActive(null), 6600);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(tattooTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  return (
    <main className={`atelier ${mobileAutoplay ? "mobile-autoplay" : ""} ${active ? `atelier-${active}` : ""}`}>
      <header className="atelier-header"><a className="atelier-brand" href="/" aria-label="The Needle Lounge home"><span>N</span><p><b>The Needle</b><i>Lounge</i></p></a><p className="atelier-address">19 Mardol · Shrewsbury<span>Independent body art studio</span></p><p className="atelier-prompt">Choose your craft <b>↓</b></p></header>
      <section className="atelier-stage" aria-label="Choose piercing or tattoo">
        <div className="atelier-panel atelier-piercing" onMouseEnter={() => enter("piercing")} onMouseLeave={() => setActive(null)}>
          <div className="word-theatre piercing-theatre" ref={piercingTheatre}>
            <span className="animated-word word-ghost" aria-hidden="true">Pıercıng</span>
            <span className="animated-word word-fill" aria-hidden="true" ref={piercingFill}>P<span className="dotted-letter" ref={firstI}>ı<i className="drawn-dot" ref={firstDot} /></span>erc<span className="dotted-letter" ref={secondI}>ı<i className="drawn-dot" ref={secondDot} /></span>ng</span>
            <span className="travelling-needle" ref={needle} aria-hidden="true"><i className="needle-eye" /><i className="needle-shaft" /><i className="needle-tip" /></span>
          </div>
          <p className="atelier-copy">Considered adornment.<br />Beautifully, unmistakably yours.</p><span className="atelier-enter">Enter the lounge</span>
        </div>
        <div className="atelier-panel atelier-tattoo" onMouseEnter={() => enter("tattoo")} onMouseLeave={() => setActive(null)}>
          <div className="word-theatre tattoo-theatre" ref={tattooTheatre}>
            <span className="tattoo-word tattoo-ghost" ref={tattooGhost} aria-hidden="true">TATTOO</span>
            {[0,1,2,3,4].map((index) => <span className={`tattoo-ink-band band-${index + 1}`} key={index} aria-hidden="true"><span className="tattoo-word" ref={(element) => { inkBands.current[index] = element; }}>TATTOO</span></span>)}
            <span className="tattoo-word tattoo-final-fill" ref={tattooFinalFill} aria-hidden="true">TATTOO</span>
            <span className="tattoo-word tattoo-dot-fill" ref={tattooDotFill} aria-hidden="true">TATTOO</span>
            <span className="tattoo-dot-field" aria-hidden="true" />
            <span className="tattoo-fine-detail" aria-hidden="true"><i /><i /><i /></span>
            <span className="tattoo-machine" ref={tattooMachine} aria-hidden="true"><i className="machine-frame" /><i className="machine-coil coil-a" /><i className="machine-coil coil-b" /><i className="machine-grip" /><i className="machine-needle" /></span>
          </div>
          <p className="atelier-copy">Original work by Abbie Fletcher.</p><img className="fletcher-logo-art" src="/fletcher-tattoos-logo.png" alt="Fletcher Tattoos" /><span className="atelier-enter">Fletcher Tattoos</span>
        </div>
      </section>
      <footer className="atelier-footer"><span>SHREWSBURY · SY1 1PU</span><span><i /> PRIVATE · WELCOMING · INDEPENDENT</span><span>EST. FOR SELF-EXPRESSION</span></footer>
    </main>
  );
}
