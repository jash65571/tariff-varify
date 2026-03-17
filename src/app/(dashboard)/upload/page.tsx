import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UploadWizard } from "@/components/upload/upload-wizard";

export const metadata: Metadata = {
  title: "Upload BOM — TariffVerify",
};

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();

  const { count } = await supabase
    .from("bom_uploads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("status", "completed");

  return (
    <UploadWizard
      plan={profile?.plan ?? "free"}
      userId={user!.id}
      uploadCount={count ?? 0}
    />
  );
}
