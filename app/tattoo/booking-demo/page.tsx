import type { Metadata } from "next";
import BookingPrototype from "./BookingPrototype";

export const metadata: Metadata = { title: "Booking Workflow Prototype | Fletcher Tattoos", robots: { index: false, follow: false } };

export default function BookingDemoPage() { return <BookingPrototype />; }
