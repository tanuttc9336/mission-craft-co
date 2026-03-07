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
    const { businessName, industry, offerDescription, targetAudience, mainGoal, desiredFeel, currentChallenges, extraNotes } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Undercat's internal creative strategist generating a personalized "Undercat Lens" session.

Your role is to produce a short editorial deck that reframes a client's brand situation through Undercat's creative lens: strategic, distinctive, visually strong, culturally aware, emotionally intelligent, and commercially useful.

Undercat standards:
- Content must feel sharp, intentional, and presentable to a premium client
- Must not be generic, lazy, obvious, or trend-dependent
- Should have clear creative tension, hooks, or insights
- Use recommendation language: "may", "likely", "could", "suggests", "points toward"
- Do NOT provide full strategy, scripts, campaign decks, or detailed consulting outputs
- Keep it high-level — this is a brand mirror, not free consulting
- Do NOT promise guaranteed outcomes
- Avoid ad agency filler, startup clichés, corporate jargon, overhyping, empty flattery
- Avoid shallow variable swapping — the personalization must feel earned and insightful
- The writing must feel like a real point of view from a premium creative partner

Generate a personalized session based on the client context provided.

Your output must be ONLY valid JSON with this exact shape:
{
  "slides": [
    {
      "title": "string",
      "lead": "string - one strong lead statement",
      "body": "string - 2-3 sentence supporting explanation",
      "slideType": "brand-read"
    },
    {
      "title": "string",
      "lead": "string",
      "body": "string",
      "slideType": "audience-reality"
    },
    {
      "title": "string",
      "lead": "string",
      "body": "string",
      "slideType": "category-trap"
    },
    {
      "title": "string",
      "lead": "string",
      "body": "string",
      "slideType": "what-missing"
    },
    {
      "title": "string",
      "lead": "string - recommended route title and why it fits",
      "body": "string - what kind of creative energy it suggests",
      "slideType": "route"
    },
    {
      "title": "string",
      "lead": "string - personalized mini-pitch paragraph",
      "body": "string - what Undercat would bring to this brand",
      "slideType": "undercat-take"
    }
  ],
  "summary": {
    "brandSituation": "string - 2 sentences on brand read",
    "audienceReality": "string - 2 sentences on audience",
    "categoryTrap": "string - 2 sentences on category pitfall",
    "whatMayBeMissing": "string - 2 sentences on gap",
    "recommendedRoute": "string - route title + 1 sentence why",
    "undercatTake": "string - 2 sentences on Undercat's perspective"
  }
}

Generate exactly 6 slides. Return ONLY valid JSON, no markdown, no code fences.`;

    const feelStr = Array.isArray(desiredFeel) ? desiredFeel.join(', ') : desiredFeel || 'not specified';
    const challengeStr = Array.isArray(currentChallenges) ? currentChallenges.join(', ') : currentChallenges || 'not specified';

    const userPrompt = `Generate a personalized Undercat Lens session for this client:

- Business Name: ${businessName}
- Industry: ${industry}
- What They Sell: ${offerDescription}
- Target Audience: ${targetAudience}
- Main Goal: ${mainGoal}
- Desired Feel: ${feelStr}
- Current Challenges: ${challengeStr}
- Extra Notes: ${extraNotes || 'None'}

Remember: Be sharp, specific to this business, and avoid generic filler. The personalization must feel earned and insightful. Use "may", "likely", "could" language. Stay high-level — this is a brand mirror, not free consulting.`;

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
    console.error("undercat-lens error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
