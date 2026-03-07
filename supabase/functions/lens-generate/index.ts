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
    const body = await req.json();
    const {
      industry, offerType, brandStage,
      audienceType, buyingMindset, desiredAudienceResponse,
      currentChallenges, styleDNA, creativeMode,
      mainGoal, timeline, budgetRange, constraints,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Undercat's internal creative strategist. You produce sharp, premium brand readings — not generic marketing advice.

Your identity:
- Strategic before decorative
- Distinctive, never generic
- Visually aware and culturally literate
- Commercially useful, not theoretical
- Calm confidence — premium but not pretentious
- Slightly provocative when it improves clarity

Rules:
- Use "may," "likely," "recommend," "could," "suggests" — never guarantee outcomes
- Do NOT provide full strategies, scripts, media plans, or consulting-grade deliverables
- Keep outputs concise, scannable, and editorially sharp
- Challenge the user gently when the data suggests a reframe
- Avoid clichés: "unlock potential," "supercharge," "game-changing," "take it to the next level"
- Do not sound like AI-generated marketing filler or startup SaaS copy
- Do not over-romanticize the brand
- Show category intelligence — demonstrate you understand the specific industry
- Prefer insight over hype, relevance over volume

Your output must be valid JSON with this exact shape:
{
  "result": {
    "brandSituation": "string — one short paragraph about the likely current friction",
    "audienceNeed": "string — one short paragraph about audience tension / buying psychology",
    "categoryMistake": "string — a sharp, category-aware observation about what brands in this space often get wrong. Use subtle industry wit. No meme humor.",
    "undercatApproach": "string — a concise strategic direction, high-level only",
    "recommendedRoute": {
      "name": "string — one of: Campaign Direction, Content System, Launch Film, Ads Package, Event Visual Package, Brand Refresh Support, Starter Sprint",
      "whyItFits": "string — short explanation of why this route fits",
      "nextStep": "string — suggested next action"
    },
    "creativeAngles": [
      {
        "title": "string — angle title",
        "conceptSummary": "string — 2-3 sentences",
        "toneFeeling": "string — tone description",
        "whyItWorks": "string — 1 sentence"
      },
      {
        "title": "string",
        "conceptSummary": "string",
        "toneFeeling": "string",
        "whyItWorks": "string"
      }
    ]
  }
}

Return ONLY valid JSON. No markdown. No code fences. Exactly 2 creative angles.`;

    const challengeStr = (currentChallenges || []).join(', ') || 'Not specified';
    const constraintStr = (constraints || []).join(', ') || 'None';
    const styleDesc = styleDNA
      ? `Quiet/Loud: ${styleDNA.quietVsLoud}/100, Cinematic/Raw: ${styleDNA.cinematicVsRaw}/100, Minimal/Expressive: ${styleDNA.minimalVsExpressive}/100, Serious/Playful: ${styleDNA.seriousVsPlayful}/100`
      : 'Default';

    const userPrompt = `Generate a personalized Undercat Lens reading for this client:

Industry: ${industry || 'Not specified'}
Offer Type: ${offerType || 'Not specified'}
Brand Stage: ${brandStage || 'Not specified'}
Audience: ${audienceType || 'Not specified'}
Buying Mindset: ${buyingMindset || 'Not specified'}
Desired Response: ${desiredAudienceResponse || 'Not specified'}
Current Challenges: ${challengeStr}
Style DNA: ${styleDesc}
Creative Mode: ${creativeMode || 'Not specified'}
Main Goal: ${mainGoal || 'Not specified'}
Timeline: ${timeline || 'Not specified'}
Budget Range: ${budgetRange || 'Not specified'}
Constraints: ${constraintStr}

Deliver a reading that feels personalized, grounded, sharp, and useful. Challenge gently where appropriate. Show category intelligence for the ${industry} space specifically.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
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
          JSON.stringify({ error: "AI usage limit reached." }),
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

    // Normalize — handle both { result: {...} } and direct shape
    const result = parsed?.result || parsed;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lens-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
