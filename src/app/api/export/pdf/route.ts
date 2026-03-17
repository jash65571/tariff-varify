import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { canAccess } from "@/lib/stripe/plans";
import { ReportDocument } from "@/lib/pdf/report-document";
import type { ReportData } from "@/lib/pdf/report-document";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing upload id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, company_name")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan || "free";

  if (!canAccess(plan, "pdf_export")) {
    return Response.json({ error: "Upgrade to Pro to export PDF reports" }, { status: 403 });
  }

  const { data: upload } = await supabase
    .from("bom_uploads")
    .select("*")
    .eq("id", id)
    .single();

  if (!upload || upload.user_id !== user.id) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("bom_items")
    .select("*")
    .eq("upload_id", id)
    .order("tariff_cost", { ascending: false });

  const all = items || [];
  const atRisk = all.filter(
    (i: { risk_level: string }) => i.risk_level === "high" || i.risk_level === "critical"
  ).length;

  const data: ReportData = {
    companyName: profile?.company_name || "—",
    filename: upload.filename,
    date: new Date(upload.created_at).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    }),
    totalSpend: Number(upload.total_spend) || 0,
    totalExposure: Number(upload.total_tariff_exposure) || 0,
    effectiveRate: Number(upload.effective_tariff_rate) || 0,
    itemsAtRisk: atRisk,
    items: all.map((i: Record<string, unknown>) => ({
      item_name: String(i.item_name || ""),
      supplier_country: String(i.supplier_country || ""),
      annual_spend: Number(i.annual_spend) || 0,
      tariff_rate: Number(i.tariff_rate) || 0,
      tariff_cost: Number(i.tariff_cost) || 0,
      risk_level: String(i.risk_level || "low"),
    })),
  };

  const element = React.createElement(ReportDocument, { data });
  const buffer = await renderToBuffer(
    element as unknown as React.ReactElement<DocumentProps>
  );

  return new Response(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="tariff-report-${upload.filename}.pdf"`,
    },
  });
}
