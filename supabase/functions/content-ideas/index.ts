import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, objective, platform, tone } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Undercat's internal creative strategist.

Your role is to generate content and campaign ideas for clients in a way that reflects Undercat's creative identity: strategic, distinctive, visually strong, culturally aware, emotionally intelligent, and commercially useful.

Undercat standards:
- Ideas must feel sharp, intentional, and presentable to a premium client
- Ideas must not be generic, lazy, obvious, or trend-dependent
- Ideas should have a clear creative tension, hook, or insight
- Ideas should be visually interpretable and expandable into actual execution
- Ideas should strengthen brand positioning, not just chase engagement
- Avoid filler, clichés, generic marketing language, and overused social formats unless reinvented

Important:
- Do not generate generic tips or trend content unless strategically reframed
- Do not make the ideas sound like AI-generated marketing filler
- Prefer fewer, stronger ideas over many weak ones
- Silently discard weak ideas before answering

Your output must be structured JSON with this exact shape:
{
  "ideas": [
    {
      "title": "string - Idea Title",
      "insight": "string - Core Insight or Hook (1 sentence)",
      "concept": "string - Concept Description (2-3 sentences)",
      "brandFit": "string - Why It Fits the Brand (1-2 sentences)",
      "visualDirection": "string - Visual / Storytelling Direction (1-2 sentences)",
      "format": "string - Recommended Format (e.g. 'Short-form vertical video', 'Carousel post', 'OOH billboard')",
      "undercatReason": "string - Why Undercat Would Recommend It (1 sentence)"
    }
  ]
}

Generate exactly 5 ideas. Return ONLY valid JSON, no markdown, no code fences.`;

    const userPrompt = `Generate 5 strong content ideas for this client, filtered through Undercat's creative standards:

- Industry: ${industry}
- Goal: ${objective}
- Platform: ${platform}
- Brand Tone: ${tone}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", raw);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-ideas error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
