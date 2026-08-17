"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

type Status = "enquiry" | "quote-ready" | "rejected" | "rejection-sent" | "quoted" | "accepted" | "deposit-paid" | "confirmed" | "expired";
type Audience = "abby" | "customer" | "both";
type MailAction = "enquiry" | "customer";
type Activity = { id: string; at: string; type: "email" | "system" | "payment"; audience?: Audience; link?: "enquiry"; subject?: string; action?: MailAction; text: string };
type DemoState = {
  now: string; status: Status; client: { name: string; email: string; brief: string; placement: string; references: string[] };
  quote: { duration: number; price: number; deposit: number; sentAt: string | null; deadline: string | null };
  slot: string | null; hours: { start: number; end: number; days: number[] }; unavailable: string[]; activities: Activity[]; readIds: string[]; rejectionReason?: string;
};

const STORE = "fletcher-booking-prototype-v1";
const isoDay = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, days: number) => { const d = new Date(value); d.setDate(d.getDate() + days); return d.toISOString(); };
const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value || 0);
const readable = (value: string | null) => value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const seed = (): DemoState => ({ now: new Date().toISOString(), status: "enquiry", client: { name: "", email: "", brief: "", placement: "", references: [] }, quote: { duration: 1.5, price: 180, deposit: 55, sentAt: null, deadline: null }, slot: null, hours: { start: 10, end: 18, days: [2,3,4,5,6] }, unavailable: [], activities: [{ id: "welcome", at: new Date().toISOString(), type: "system", audience: "both", text: "Local booking sandbox created. No external services are connected." }], readIds: [] });

const localAdapter = {
  load(): DemoState { try { const value = localStorage.getItem(STORE); if (!value) return seed(); const saved = JSON.parse(value); return { ...seed(), ...saved, activities: (saved.activities ?? []).map((item: Activity) => ({ ...item, audience: item.audience ?? "both" })) }; } catch { return seed(); } },
  save(value: DemoState) { try { localStorage.setItem(STORE, JSON.stringify(value)); } catch {} },
};

function activity(text: string, type: Activity["type"], now: string, audience: Audience = "both", link?: Activity["link"]): Activity { return { id: `${Date.now()}-${Math.random()}`, at: now, type, audience, link, text }; }
function fakeMail(subject: string, text: string, now: string, audience: Exclude<Audience, "both">, action?: MailAction): Activity { return { id: `${Date.now()}-${Math.random()}`, at: now, type: "email", audience, subject, action, link: action === "enquiry" ? "enquiry" : undefined, text }; }

export default function BookingPrototype() {
  const [demo, setDemo] = useState<DemoState>(seed);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<"enquiry" | "studio" | "customer" | "calendar" | "notifications" | "customer-mail" | "studio-mail">("enquiry");
  const [depositOverride, setDepositOverride] = useState(false);
  const [blockedTime, setBlockedTime] = useState("");
  const [role, setRole] = useState<"customer" | "abby">("customer");
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [focusEnquiry, setFocusEnquiry] = useState(false);
  const [openMailId, setOpenMailId] = useState<string | null>(null);

  useEffect(() => {
    setDemo(localAdapter.load());
    const requested = new URLSearchParams(window.location.search).get("view");
    if (requested === "enquiry" || requested === "customer-mail" || requested === "studio-mail" || requested === "studio" || requested === "customer" || requested === "calendar" || requested === "notifications") {
      setView(requested);
      setRole(requested === "studio" || requested === "studio-mail" || requested === "calendar" || requested === "notifications" ? "abby" : "customer");
    }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localAdapter.save(demo); }, [demo, ready]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === STORE && event.newValue) setDemo(localAdapter.load()); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!ready || !["quoted", "accepted"].includes(demo.status) || !demo.quote.deadline) return;
    const now = new Date(demo.now).getTime(), deadline = new Date(demo.quote.deadline).getTime();
    const reminderDates = [7, 2].map((days) => ({ days, time: deadline - days * 86400000 }));
    const additions = reminderDates.filter(({ days, time }) => now >= time && !demo.activities.some((item) => item.id === `reminder-${days}`)).map(({ days }) => ({ id: `reminder-${days}`, at: demo.now, type: "email" as const, audience: "customer" as const, text: `Mock deposit reminder generated: ${days} day${days === 1 ? "" : "s"} before deadline.` }));
    if (now > deadline) {
      setDemo((value) => ({ ...value, status: "expired", slot: null, activities: [...value.activities, ...additions, fakeMail("Your quote has expired", "The 30-day quote window ended without deposit payment. Date selection is no longer available; contact the studio if you would like to restart.", value.now, "customer", "customer"), activity("Quote expired after 30 days without deposit. No appointment slot had been reserved.", "system", value.now, "abby")] }));
    } else if (additions.length) setDemo((value) => ({ ...value, activities: [...value.activities, ...additions] }));
  }, [demo.now, demo.status, demo.quote.deadline, ready]);

  const slots = useMemo(() => {
    if (demo.status !== "deposit-paid") return [];
    const now = new Date(demo.now), first = new Date(demo.now); first.setHours(0,0,0,0);
    const durationMs = demo.quote.duration * 3600000, result: string[] = [];
    for (let day = 0; day < 75 && result.length < 18; day++) {
      const date = new Date(first); date.setDate(first.getDate() + day);
      if (!demo.hours.days.includes(date.getDay())) continue;
      for (let hour = demo.hours.start; hour + demo.quote.duration <= demo.hours.end; hour += .5) {
        const start = new Date(date); start.setHours(Math.floor(hour), hour % 1 ? 30 : 0, 0, 0);
        const end = start.getTime() + durationMs;
        const blocked = demo.unavailable.some((value) => { const b = new Date(value).getTime(); return b >= start.getTime() && b < end; });
        if (!blocked && start.getTime() >= now.getTime()) result.push(start.toISOString());
      }
    }
    return result;
  }, [demo.now, demo.status, demo.quote.duration, demo.hours, demo.unavailable]);

  const calendarDays = useMemo(() => {
    const base = new Date(addDays(demo.now, calendarOffset * 7)); base.setHours(0,0,0,0);
    const mondayShift = (base.getDay() + 6) % 7; base.setDate(base.getDate() - mondayShift);
    return Array.from({ length: 7 }, (_, index) => { const day = new Date(base); day.setDate(base.getDate() + index); return day; });
  }, [demo.now, calendarOffset]);
  const calendarTimes = useMemo(() => Array.from({ length: Math.max(0, (demo.hours.end - demo.hours.start) * 2) }, (_, index) => demo.hours.start + index * .5), [demo.hours]);
  function calendarCell(day: Date, hour: number) {
    const at = new Date(day); at.setHours(Math.floor(hour), hour % 1 ? 30 : 0, 0, 0); const time = at.getTime();
    if (!demo.hours.days.includes(day.getDay())) return "closed";
    if (time < new Date(demo.now).getTime()) return "notice";
    const bookingStart = demo.slot ? new Date(demo.slot).getTime() : -1, bookingEnd = bookingStart + demo.quote.duration * 3600000;
    if (time >= bookingStart && time < bookingEnd) return demo.status === "confirmed" ? "confirmed" : "available";
    if (demo.unavailable.some((value) => Math.abs(new Date(value).getTime() - time) < 30 * 60000)) return "blocked";
    return "available";
  }
  const abbyInbox = demo.activities.filter((item) => item.audience === "abby" || item.audience === "both");
  const customerInbox = demo.activities.filter((item) => item.audience === "customer" || item.audience === "both");
  const abbyUnread = abbyInbox.filter((item) => !demo.readIds.includes(item.id)).length;
  const abbyMail = demo.activities.filter((item) => item.type === "email" && item.audience === "abby");
  const customerMail = demo.activities.filter((item) => item.type === "email" && item.audience === "customer");
  const currentMail = view === "studio-mail" ? abbyMail : customerMail;
  const openMail = currentMail.find((item) => item.id === openMailId) ?? null;
  const abbyMailUnread = abbyMail.filter((item) => !demo.readIds.includes(item.id)).length;
  const customerMailUnread = customerMail.filter((item) => !demo.readIds.includes(item.id)).length;

  function markRead(id: string) { setDemo((value) => value.readIds.includes(id) ? value : ({ ...value, readIds: [...value.readIds, id] })); }
  function openFakeMail(item: Activity) { setOpenMailId(item.id); markRead(item.id); }
  function followMailAction(item: Activity) { markRead(item.id); setOpenMailId(null); if (item.action === "enquiry") { setRole("abby"); setView("studio"); setFocusEnquiry(true); window.setTimeout(() => setFocusEnquiry(false), 2400); } else { setRole("customer"); setView("customer"); } }
  function clearMailbox(audience: "abby" | "customer") { setDemo((value) => ({ ...value, activities: value.activities.filter((item) => !(item.type === "email" && item.audience === audience)), readIds: [] })); setOpenMailId(null); }
  function openNotification(item: Activity) { markRead(item.id); if (item.link === "enquiry") { setRole("abby"); setView("studio"); setFocusEnquiry(true); window.setTimeout(() => setFocusEnquiry(false), 2400); } }
  function clearAbbyNotifications() { const ids = new Set(abbyInbox.map((item) => item.id)); setDemo((value) => ({ ...value, activities: value.activities.filter((item) => !ids.has(item.id)), readIds: [] })); }
  function acceptEnquiry() { setDemo((value) => ({ ...value, status: "quote-ready", activities: [...value.activities, activity("Internal triage: enquiry accepted and marked quote-ready. Customer not contacted.", "system", value.now, "abby")] })); setRole("abby"); setView("studio"); }
  function rejectEnquiry() { const reason = rejectionReason.trim(); if (reason.length < 3) return; setDemo((value) => ({ ...value, status: "rejected", rejectionReason: reason, slot: null, activities: [...value.activities, activity(`Internal triage: enquiry rejected. Reason recorded for Abby only: ${reason}`, "system", value.now, "abby")] })); setRole("abby"); setView("studio"); }
  function sendRejection() { if (demo.status !== "rejected" || !demo.rejectionReason) return; setDemo((value) => ({ ...value, status: "rejection-sent", activities: [...value.activities, fakeMail("An update on your tattoo enquiry", `Abby cannot progress this enquiry. Reason: ${value.rejectionReason}`, value.now, "customer", "customer")] })); setRole("customer"); setView("customer-mail"); }

  function update(next: Partial<DemoState>) { setDemo((value) => ({ ...value, ...next })); }
  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const files = data.getAll("references") as File[];
    update({ status: "enquiry", rejectionReason: "", client: { name: String(data.get("name")), email: String(data.get("email")), brief: String(data.get("brief")), placement: String(data.get("placement")), references: files.filter((f) => f.size).map((f) => f.name) }, activities: [...demo.activities, fakeMail("New tattoo enquiry received", `${String(data.get("name"))} submitted a new enquiry for ${String(data.get("placement"))}. Open it to review the brief and references.`, demo.now, "abby", "enquiry")] }); setRole("abby"); setView("studio-mail");
  }
  function setQuote(key: "duration" | "price" | "deposit", value: number) {
    setDemo((current) => { const quote = { ...current.quote, [key]: value }; if (key === "price" && !depositOverride) quote.deposit = Math.max(50, Math.round(value * .3 / 5) * 5); return { ...current, quote }; });
  }
  function sendQuote() {
    if (demo.status !== "quote-ready") return;
    const sentAt = demo.now, deadline = addDays(sentAt, 30);
    setDemo((value) => ({ ...value, status: "quoted", quote: { ...value.quote, sentAt, deadline }, activities: [...value.activities, fakeMail("Your Fletcher Tattoos quote is ready", `Total: ${money(value.quote.price)} · Deposit: ${money(value.quote.deposit)} · Payment deadline: ${readable(deadline)} · Remaining balance on appointment day: ${money(value.quote.price-value.quote.deposit)}.`, value.now, "customer", "customer")] })); setRole("customer"); setView("customer-mail");
  }
  function chooseSlot(slot: string) { setDemo((value) => ({ ...value, status: "confirmed", slot, activities: [...value.activities, fakeMail("Appointment selected after deposit", `${value.client.name} selected ${readable(slot)}. The appointment is now confirmed.`, value.now, "abby", "enquiry"), fakeMail("Your tattoo appointment is booked", `Appointment: ${readable(slot)}. Remaining balance due on the day: ${money(value.quote.price-value.quote.deposit)}.`, value.now, "customer", "customer")] })); }
  function payDeposit() { if (demo.status !== "accepted") return; setDemo((value) => ({ ...value, status: "deposit-paid", activities: [...value.activities, fakeMail("Deposit payment received", `${value.client.name} completed the mock ${money(value.quote.deposit)} deposit. Date selection is now unlocked.`, value.now, "abby", "enquiry"), fakeMail("Deposit confirmed — choose your appointment", `Your mock deposit of ${money(value.quote.deposit)} is recorded. You can now choose an eligible date and time. Remaining balance due on the appointment day: ${money(value.quote.price-value.quote.deposit)}.`, value.now, "customer", "customer")] })); }
  function advance(days: number) { setDemo((value) => ({ ...value, now: addDays(value.now, days) })); }
  function loadSample() { setDemo((value) => ({ ...value, status: "enquiry", rejectionReason: "", client: { name: "Jamie Demo", email: "jamie@example.test", brief: "A fine-line botanical piece with dotwork shading and a small moon detail.", placement: "Outer left forearm", references: ["botanical-reference.jpg"] }, slot: null, activities: [...value.activities, fakeMail("New tattoo enquiry received", "Jamie Demo submitted a sample enquiry for the outer left forearm. Open it to review the brief and reference image.", value.now, "abby", "enquiry")] })); setRole("abby"); setView("studio-mail"); }
  function reset() { const next = seed(); setDemo(next); localAdapter.save(next); setView("enquiry"); setDepositOverride(false); }

  return <main className={`bp-page bp-state-${demo.status} ${focusEnquiry ? "bp-focus-enquiry" : ""}`}>
    <header className="bp-header"><a href="/tattoo">Fletcher Tattoos</a><div><strong>Local workflow lab</strong><span>Mock email · Mock payment · Demo data only</span></div><button onClick={reset}>Reset demo</button></header>
    <div className="bp-window-links" aria-label="Stable local testing views"><span>Open test view</span><a href="/tattoo/booking-demo?view=enquiry">Customer booking</a><a href="/tattoo/booking-demo?view=customer-mail">Customer Mail</a><a href="/tattoo/booking-demo?view=studio-mail">Abby / Studio Mail</a></div>
    <section className="bp-role-switch" aria-label="Local role testing"><span>Testing as</span><button className={role === "customer" ? "is-active" : ""} onClick={()=>{setRole("customer");setView(customerMail.length ? "customer-mail" : "enquiry")}}>Customer <b>{customerMailUnread}</b></button><i>⇄</i><button className={role === "abby" ? "is-active" : ""} onClick={()=>{setRole("abby");setView("studio-mail")}}>Abby <b>{abbyMailUnread}</b></button><em>Local simulated notifications</em></section>
    <nav className="bp-tabs" aria-label="Booking prototype views">{(["enquiry","studio-mail","studio","notifications","customer-mail","customer","calendar"] as const).map((item) => <button key={item} className={view === item ? "is-active" : ""} onClick={() => { setView(item); setOpenMailId(null); setRole(item === "studio" || item === "studio-mail" || item === "calendar" || item === "notifications" ? "abby" : "customer"); }}>{item === "studio" ? "Abby’s dashboard" : item === "studio-mail" ? `Studio Mail (${abbyMailUnread})` : item === "customer-mail" ? `Customer Mail (${customerMailUnread})` : item === "notifications" ? `Notifications (${abbyUnread})` : item}</button>)}</nav>
    <section className="bp-clock"><div><span>Simulated time</span><strong>{readable(demo.now)}</strong></div><div><button onClick={loadSample}>Load sample</button><button onClick={() => advance(1)}>+1 day</button><button onClick={() => advance(7)}>+7 days</button><button onClick={() => advance(31)}>+31 days</button></div><span className={`bp-status is-${demo.status}`}>{demo.status}</span></section>

    {view === "enquiry" && <section className="bp-panel"><div className="bp-title"><span>Customer · Step 01</span><h1>Start the<br/><em>conversation.</em></h1><p>This form stores a demo enquiry in this browser only.</p></div><form className="bp-form" onSubmit={submitEnquiry}><label>Name<input name="name" required defaultValue={demo.client.name}/></label><label>Email<input name="email" type="email" required defaultValue={demo.client.email}/></label><label className="wide">Tattoo brief<textarea name="brief" required minLength={20} defaultValue={demo.client.brief}/></label><label className="wide">Placement<input name="placement" required defaultValue={demo.client.placement}/></label><label className="wide">Reference images<input name="references" type="file" accept="image/*" multiple required={demo.client.references.length === 0}/><small>Local filenames only in this workflow demo. Nothing is uploaded.</small></label><button className="wide" type="submit">Save enquiry for Abby</button></form></section>}

    {view === "studio" && <section className="bp-panel"><div className="bp-title"><span>Private-style studio view · Step 02</span><h1>Review.<br/><em>Price. Send.</em></h1><p>{demo.client.name ? `${demo.client.name} · ${demo.client.email}` : "No customer enquiry yet."}</p></div><div className="bp-studio"><article className="bp-brief"><h2>Enquiry</h2><p>{demo.client.brief || "Complete the customer enquiry first."}</p><dl><div><dt>Placement</dt><dd>{demo.client.placement || "—"}</dd></div><div><dt>References</dt><dd>{demo.client.references.join(", ") || "—"}</dd></div></dl></article><div className="bp-quote-editor"><label>Estimated duration (hours)<input type="number" min="0.5" max="10" step="0.5" value={demo.quote.duration} onChange={(e)=>setQuote("duration",+e.target.value)}/></label><label>Total tattoo price (£)<input type="number" min="1" step="5" value={demo.quote.price} onChange={(e)=>setQuote("price",+e.target.value)}/></label><label>Deposit (£)<input type="number" min="1" step="5" value={demo.quote.deposit} onChange={(e)=>{setDepositOverride(true);setQuote("deposit",+e.target.value)}}/><small>{depositOverride ? "Manual override" : "Suggested: 30%, rounded to £5, minimum £50"}</small></label><div className="bp-balance">Balance on appointment day <strong>{money(demo.quote.price-demo.quote.deposit)}</strong></div><button disabled={!demo.client.name} onClick={sendQuote}>Simulate sending quote</button></div></div></section>}

    {view === "customer" && <section className="bp-panel"><div className="bp-title"><span>Customer quote · Steps 03–05</span><h1>Your piece.<br/><em>Your slot.</em></h1><p>This is a simulated secure-link view. No charge can be made.</p></div><div className="bp-customer"><article className="bp-quote-card"><span>Quote for {demo.client.name || "customer"}</span><h2>{money(demo.quote.price)}</h2><p>{demo.quote.duration} hours · {demo.client.placement || "Placement pending"}</p><dl><div><dt>Mock deposit</dt><dd>{money(demo.quote.deposit)}</dd></div><div><dt>Balance on the day</dt><dd>{money(demo.quote.price-demo.quote.deposit)}</dd></div><div><dt>Deposit deadline</dt><dd>{readable(demo.quote.deadline)}</dd></div></dl>{demo.status === "quoted" && <button onClick={()=>update({status:"accepted",activities:[...demo.activities,activity("Customer accepted the quote.","system",demo.now)]})}>Accept quote</button>}{demo.status === "provisional" && <button onClick={payDeposit}>Simulate deposit payment</button>}{demo.status === "confirmed" && <strong className="bp-confirmed">Deposit paid · Booking confirmed</strong>}{demo.status === "expired" && <strong className="bp-expired">Deposit expired · Slot released</strong>}</article>{["accepted","provisional"].includes(demo.status) && <div className="bp-slots"><h2>{demo.status === "provisional" ? "Provisional appointment" : "Choose a viable appointment"}</h2>{demo.slot && <p className="bp-selected">Held: {readable(demo.slot)} until {readable(demo.quote.deadline)}</p>}<div>{slots.map((slot)=><button key={slot} onClick={()=>chooseSlot(slot)}>{readable(slot)}</button>)}</div></div>}</div></section>}

    {view === "calendar" && <section className="bp-panel"><div className="bp-title"><span>Studio settings</span><h1>Hours &amp;<br/><em>availability.</em></h1><p>Only slots that fit the full quoted duration are offered.</p></div><div className="bp-calendar"><div className="bp-hours"><label>Working day starts<input type="number" min="0" max="23" value={demo.hours.start} onChange={(e)=>setDemo(v=>({...v,hours:{...v.hours,start:+e.target.value}}))}/></label><label>Working day ends<input type="number" min="1" max="24" value={demo.hours.end} onChange={(e)=>setDemo(v=>({...v,hours:{...v.hours,end:+e.target.value}}))}/></label><fieldset><legend>Working days</legend>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day,index)=><label key={day}><input type="checkbox" checked={demo.hours.days.includes(index)} onChange={()=>setDemo(v=>({...v,hours:{...v.hours,days:v.hours.days.includes(index)?v.hours.days.filter(d=>d!==index):[...v.hours.days,index]}}))}/>{day}</label>)}</fieldset></div><div className="bp-blocks"><h2>Unavailable times</h2><div><input type="datetime-local" value={blockedTime} onChange={(e)=>setBlockedTime(e.target.value)}/><button onClick={()=>{if(blockedTime){setDemo(v=>({...v,unavailable:[...v.unavailable,new Date(blockedTime).toISOString()]}));setBlockedTime("")}}}>Block time</button></div>{demo.unavailable.map((time)=><button className="bp-block" key={time} onClick={()=>setDemo(v=>({...v,unavailable:v.unavailable.filter(x=>x!==time)}))}>{readable(time)} <span>remove</span></button>)}{demo.slot && <p>Calendar hold: <strong>{readable(demo.slot)}</strong> · {demo.status}</p>}</div></div></section>}

    {view === "calendar" && <section className="bp-visual-calendar" aria-label="Abby’s operational calendar"><header><div><span>Operational week view</span><h2>{calendarDays[0].toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</h2></div><div><button onClick={()=>setCalendarOffset(v=>v-1)}>Previous week</button><button onClick={()=>setCalendarOffset(0)}>First bookable week</button><button onClick={()=>setCalendarOffset(v=>v+1)}>Next week</button></div></header><div className="bp-calendar-legend"><span className="available">Available</span><span className="blocked">Unavailable</span><span className="provisional">Provisional</span><span className="confirmed">Confirmed</span><span className="closed">Outside working hours</span></div><div className="bp-week-grid"><div className="bp-week-corner">Time</div>{calendarDays.map(day=><div className="bp-day-head" key={day.toISOString()}><strong>{day.toLocaleDateString("en-GB",{weekday:"short"})}</strong><span>{day.toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</span></div>)}{calendarTimes.map(hour=><div className="bp-time-row" key={hour}><time>{`${String(Math.floor(hour)).padStart(2,"0")}:${hour%1?"30":"00"}`}</time>{calendarDays.map(day=>{const state=calendarCell(day,hour);return <button key={`${day.toISOString()}-${hour}`} className={`bp-cal-cell is-${state}`} title={`${state} · ${day.toLocaleDateString("en-GB")} ${hour}`} onClick={()=>{if(state==="available"){const at=new Date(day);at.setHours(Math.floor(hour),hour%1?30:0,0,0);setBlockedTime(at.toISOString().slice(0,16));}}}><span>{state === "available" ? "Available" : state}</span></button>})}</div>)}</div><p className="bp-calendar-help">Tap an available cell to prefill the “block time” control above. The customer slot engine uses the same working-hours, notice-period and conflict rules.</p></section>}

    {view === "notifications" && <section className="bp-notification-centre"><header><div><span>Abby · Local simulated inbox</span><h1>Notifications</h1><p>Open an enquiry alert to jump directly to its review.</p></div><button onClick={clearAbbyNotifications} disabled={!abbyInbox.length}>Clear all</button></header><div>{[...abbyInbox].reverse().map(item=><article key={item.id} className={demo.readIds.includes(item.id)?"is-read":"is-unread"}><button className="bp-notification-open" onClick={()=>openNotification(item)}><span>{item.type}{item.link?" · linked enquiry":""}</span><strong>{item.text}</strong><time>{readable(item.at)}</time></button>{!demo.readIds.includes(item.id)&&<button className="bp-mark-read" onClick={()=>markRead(item.id)}>Mark read</button>}</article>)}{!abbyInbox.length&&<p className="bp-empty-inbox">No simulated notifications. Load a sample enquiry to test the flow again.</p>}</div></section>}
    {view === "studio" && demo.status === "enquiry" && <section className="bp-decision"><div><span>Internal decision · nothing sends yet</span><h2>Choose the enquiry outcome.</h2><p>Accept prepares the quote path. Reject records Abby’s reason. The customer is contacted only by the separate final send button shown afterwards.</p></div><div><button onClick={acceptEnquiry}>Choose accept</button><label>Reason required to reject<textarea value={rejectionReason} onChange={(event)=>setRejectionReason(event.target.value)} minLength={3} placeholder="A short, helpful reason…"/></label><button className="reject" disabled={rejectionReason.trim().length<3} onClick={rejectEnquiry}>Choose reject</button></div></section>}
    {view === "studio" && demo.status === "quote-ready" && <section className="bp-ready-banner"><div><strong>Accepted internally · quote ready to send</strong><span>No customer message has been generated yet. Check the duration, price, deposit and deadline above, then use the single final action.</span></div><button onClick={sendQuote}>Send prepared quote to Customer Mail</button></section>}
    {view === "studio" && demo.status === "rejected" && <section className="bp-ready-banner is-rejected"><div><strong>Rejected internally · reason ready to send</strong><span>{demo.rejectionReason} — Customer Mail is unchanged until the final action below.</span></div><button onClick={sendRejection}>Send rejection to Customer Mail</button></section>}
    {view === "customer" && demo.status === "rejection-sent" && <section className="bp-customer-decision is-rejected"><span>Local simulated message sent</span><h2>This enquiry won’t progress.</h2><p><strong>Abby’s reason:</strong> {demo.rejectionReason}</p><button onClick={()=>{setView("enquiry");setDemo(value=>({...value,status:"enquiry",rejectionReason:""}))}}>Start a new test enquiry</button></section>}

    {(view === "customer-mail" || view === "studio-mail") && <section className="bp-mailbox"><header><div><span>{view === "studio-mail" ? "Abby / Studio Mail" : "Customer Mail"} · Local test inbox</span><h1>{view === "studio-mail" ? "Studio inbox" : "Your inbox"}</h1><p>Realistic workflow simulation only. No message has left this browser.</p></div><div><b>{currentMail.filter(item=>!demo.readIds.includes(item.id)).length} unread</b><button onClick={()=>clearMailbox(view === "studio-mail" ? "abby" : "customer")} disabled={!currentMail.length}>Clear mailbox</button></div></header><div className="bp-mail-layout"><div className="bp-mail-list">{[...currentMail].reverse().map(item=><button key={item.id} className={`${demo.readIds.includes(item.id)?"is-read":"is-unread"} ${openMailId===item.id?"is-open":""}`} onClick={()=>openFakeMail(item)}><i/><span><strong>{item.subject || (item.type === "payment" ? "Payment status update" : "Fletcher Tattoos booking update")}</strong><small>{item.text}</small></span><time>{readable(item.at)}</time></button>)}{!currentMail.length&&<p>No fake emails yet. Use “Load sample” to begin a test journey.</p>}</div><article className="bp-mail-reader">{openMail?<><span>Local simulated email · To {openMail.audience === "abby" ? "Abby / Studio" : demo.client.email || "Customer"}</span><h2>{openMail.subject || "Fletcher Tattoos booking update"}</h2><time>{readable(openMail.at)}</time><p>{openMail.text}</p>{openMail.action&&<button onClick={()=>followMailAction(openMail)}>{openMail.action === "enquiry" ? "Review this enquiry" : demo.status === "quoted" ? "Open quote & choose a slot" : "Open customer update"}</button>}<small>No real email was sent. Links act only inside this local prototype.</small></>:<p className="bp-mail-placeholder">Select a message to read it.</p>}</article></div></section>}

    {view === "customer" && demo.status === "accepted" && <section className="bp-payment-gate"><span>Quote accepted · 30-day payment window</span><h2>Pay the deposit<br/><em>before choosing a date.</em></h2><dl><div><dt>Mock deposit</dt><dd>{money(demo.quote.deposit)}</dd></div><div><dt>Payment deadline</dt><dd>{readable(demo.quote.deadline)}</dd></div><div><dt>Appointment slots</dt><dd>Locked until payment succeeds</dd></div></dl><button onClick={payDeposit}>Simulate deposit payment</button><p>No real charge is made. Successful simulation unlocks the earliest currently available dates.</p></section>}
    {view === "customer" && demo.status === "deposit-paid" && <section className="bp-date-unlocked"><span>Deposit confirmed · date selection unlocked</span><h2>Choose an eligible appointment</h2><p>Your {demo.quote.duration}-hour appointment must fit Abby’s working hours and avoid blocked or existing calendar time.</p><div>{slots.map(slot=><button key={slot} onClick={()=>chooseSlot(slot)}>{readable(slot)}</button>)}</div></section>}

    {view === "customer" && demo.status === "expired" && <section className="bp-quote-expired"><span>30-day quote window ended</span><h2>Quote expired unpaid.</h2><p>No appointment was reserved and date selection is unavailable. Start a new local test enquiry to restart the process.</p><button onClick={()=>{setView("enquiry");setDemo(value=>({...value,status:"enquiry",quote:{...value.quote,sentAt:null,deadline:null}}))}}>Start new test enquiry</button></section>}

    <aside className="bp-activity"><div className="bp-inbox-head"><div><span>{role === "abby" ? "Abby’s private-style inbox" : "Customer notification inbox"}</span><h2>Local simulated notifications</h2></div><b>{(role === "abby" ? abbyInbox : customerInbox).length}</b></div>{[...(role === "abby" ? abbyInbox : customerInbox)].reverse().map((item)=><article key={item.id}><span>{item.type} · to {item.audience}</span><p>{item.text}</p><time>{readable(item.at)}</time></article>)}</aside>
  </main>;
}
