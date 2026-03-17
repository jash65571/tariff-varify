import { NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are analyzing a spreadsheet uploaded by a manufacturer. Identify which columns contain: product/item name, supplier country or country of origin, annual spend or cost, description, and quantity. The columns might be named anything creative. Return JSON: {"item_name": "exact header name", "supplier_country": "exact header name", "annual_spend": "exact header name", "description": "exact header name or null", "quantity": "exact header name or null", "unit_cost": "exact header name or null"}. Only return valid JSON.`;

function buildUserPrompt(
  headers: string[],
  sampleRows: string[][]
): string {
  const colWidths = headers.map((h, i) => {
    const vals = [h, ...sampleRows.map((r) => r[i] || "")];
    return Math.min(Math.max(...vals.map((v) => v.length)), 30);
  });

  const pad = (s: string, w: number) =>
    s.length > w ? s.slice(0, w) : s.padEnd(w);

  const headerLine = headers.map((h, i) => pad(h, colWidths[i])).join(" | ");
  const sep = colWidths.map((w) => "-".repeat(w)).join("-+-");
  const rows = sampleRows
    .map((r) => r.map((c, i) => pad(c || "", colWidths[i])).join(" | "))
    .join("\n");

  return `Here is the spreadsheet:\n\n${headerLine}\n${sep}\n${rows}`;
}

type Detection = { field: string; column: string; reason: string };

const FIELD_LABELS: Record<string, string> = {
  item_name: "Item Name",
  supplier_country: "Supplier Country",
  annual_spend: "Annual Spend",
  description: "Description",
  quantity: "Quantity",
  unit_cost: "Unit Cost",
};

const FIELD_REASONS: Record<string, string> = {
  item_name: "Contains product or part names",
  supplier_country: "Contains country or origin data",
  annual_spend: "Contains cost or spend values",
  description: "Contains item descriptions",
  quantity: "Contains quantity values",
  unit_cost: "Contains per-unit pricing",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { headers, sampleRows } = body as {
      headers: string[];
      sampleRows: string[][];
    };

    if (!headers?.length || !sampleRows?.length) {
      return NextResponse.json(
        { mapping: null, error: "No headers or sample rows provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { mapping: null, error: "OpenAI not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });
    const userPrompt = buildUserPrompt(headers, sampleRows.slice(0, 5));

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const text = response.choices[0]?.message?.content || "{}";
    const mapping = JSON.parse(text) as Record<string, string | null>;

    // Validate that mapped values actually exist in headers
    for (const [key, val] of Object.entries(mapping)) {
      if (val && !headers.includes(val)) {
        mapping[key] = null;
      }
    }

    const detections: Detection[] = Object.entries(mapping)
      .filter(([, val]) => val)
      .map(([key, val]) => ({
        field: FIELD_LABELS[key] || key,
        column: val as string,
        reason: FIELD_REASONS[key] || "Detected by AI",
      }));

    return NextResponse.json({ mapping, detections });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Column detection failed";
    return NextResponse.json({ mapping: null, error: message }, { status: 500 });
  }
}
