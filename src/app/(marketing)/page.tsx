import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { PainPoints } from "@/components/marketing/pain-points";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = { title: "TariffVerify — Instant Tariff Exposure Analysis" };

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
