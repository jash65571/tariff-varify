import { NextResponse } from "next/server";
import OpenAI from "openai";

type InputItem = { id: string; item_name: string; description?: string };
type ClassifiedItem = {
  id: string;
  hs_code: string | null;
  confidence: number;
  reasoning: string;
};

const SYSTEM_PROMPT =
  "You are a US customs trade classification expert. For each product, return the most likely 6-digit Harmonized System (HS) code used for US imports. Return a JSON object with a \"results\" array where each item has: hs_code (6-digit string), reasoning (one sentence), confidence (number 0.0 to 1.0). Only return valid JSON, no markdown.";

const BATCH_SIZE = 10;

async function classifyBatch(
  client: OpenAI,
  items: InputItem[]
): Promise<ClassifiedItem[]> {
  const userPrompt = items
    .map((it, i) => `${i + 1}. ${it.item_name}${it.description ? ` — ${it.description}` : ""}`)
    .join("\n");

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const text = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(text);
    const results: Array<{ hs_code: string; confidence: number; reasoning: string }> =
      parsed.results || parsed.classifications || [];

    return items.map((item, i) => ({
      id: item.id,
      hs_code: results[i]?.hs_code || null,
      confidence: results[i]?.confidence ?? 0,
      reasoning: results[i]?.reasoning || "Classification unavailable",
    }));
  } catch {
    return items.map((item) => ({
      id: item.id,
      hs_code: null,
      confidence: 0,
      reasoning: "Classification unavailable",
    }));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: InputItem[] = body.items;

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const results: ClassifiedItem[] = [];

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const batchResults = await classifyBatch(client, batch);
      results.push(...batchResults);
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
