import type { Metadata } from "next";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = { title: "FAQ — TariffVerify" };

export default function FaqPage() {
  return (
    <main className="pt-24">
      <Faq />
    </main>
  );
}
