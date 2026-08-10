import type { Metadata } from "next";
import TattooExperience from "./TattooExperience";

export const metadata: Metadata = {
  title: "Fletcher Tattoos | The Needle Lounge",
  description: "Fine line, dotwork, blackwork and portrait tattooing by Abbie Fletcher at The Needle Lounge, Shrewsbury.",
};

export default function TattooPage() {
  return <TattooExperience />;
}
