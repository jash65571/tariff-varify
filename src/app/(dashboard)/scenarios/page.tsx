import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ScenarioPaywall } from "@/components/scenarios/paywall";
import { ScenarioPage } from "@/components/scenarios/scenario-page";

export const metadata: Metadata = {
  title: "Scenarios — TariffVerify",
};

export default async function ScenariosPageRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();

  const plan = profile?.plan ?? "free";

  if (plan === "free") {
    return <ScenarioPaywall />;
  }

  const { data: uploads } = await supabase
    .from("bom_uploads")
    .select("*")
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const { data: scenarios } = await supabase
    .from("scenarios")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <ScenarioPage
      uploads={uploads || []}
      savedScenarios={scenarios || []}
      userId={user!.id}
    />
  );
}
