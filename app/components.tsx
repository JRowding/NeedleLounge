type Theme = "light" | "dark";

export function Arrow() { return <span aria-hidden="true">↗</span>; }

export function StudioNav({ theme = "light", bookingHref, bookingSoon = false }: { theme?: Theme; bookingHref?: string; bookingSoon?: boolean }) {
  return (
    <nav className={`studio-nav shell ${theme === "dark" ? "nav-dark" : ""}`} aria-label="Main navigation">
      <a className="wordmark" href="/" aria-label="The Needle Lounge home"><span className="mark">N</span><span>The Needle Lounge</span></a>
      <div className="nav-switch"><a href="/piercing">Piercing</a><i>·</i><a href="/tattoo">Tattoo</a></div>
      {bookingSoon ? <span className="nav-book nav-book-disabled" aria-disabled="true">Booking soon <span>◌</span></span> : bookingHref ? <a className="nav-book" href={bookingHref}>Book now <Arrow /></a> : <a className="nav-book" href="#visit">Visit us <span>↓</span></a>}
    </nav>
  );
}

export function StudioFooter({ theme = "light" }: { theme?: Theme }) {
  return (
    <footer className={`studio-footer ${theme === "dark" ? "footer-dark" : ""}`}>
      <div className="shell footer-grid">
        <div className="footer-brand"><span className="mark">N</span><h2>The Needle<br />Lounge</h2></div>
        <div><p className="mini-label">Find us</p><p>19 Mardol<br />Shrewsbury<br />SY1 1PU</p></div>
        <div><p className="mini-label">Explore</p><a href="/piercing">Piercing ↗</a><a href="/tattoo">Fletcher Tattoos ↗</a></div>
        <a className="top-link" href="#top">Top ↑</a>
      </div>
      <div className="shell footer-legal"><span>© 2026 The Needle Lounge</span><span>Independent body art studio</span><span>Concept site</span></div>
    </footer>
  );
}
