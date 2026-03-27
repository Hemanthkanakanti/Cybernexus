import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CyberNexus AI — a cybersecurity threat analyst embedded in a real-time threat monitoring platform.

RULES:
- Be CONCISE. Answer in 2-4 short sentences max. No long paragraphs.
- Use bullet points for lists.
- Bold key terms only.
- Reference actual data from the dashboard context when available.
- If user asks for a dashboard, generate it using the JSON block format below.

You have live dashboard data in context. Use it to answer questions about threats, severities, countries, attack types.

When user asks to "generate dashboard", "create report", "show analytics", respond with:

\`\`\`cybernexus-dashboard
{
  "title": "Title",
  "description": "Brief desc",
  "cards": [{ "label": "Metric", "value": "123", "change": "+5%", "color": "critical|high|medium|low|primary|accent" }],
  "charts": [{ "type": "bar|pie|line|area", "title": "Chart", "data": [{ "name": "Label", "value": 100 }] }],
  "insights": ["Insight 1"],
  "recommendations": ["Action 1"]
}
\`\`\`

Include 3-4 cards, 2 charts, 2+ insights, 2+ recommendations. Use real data from context.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, dashboardContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const contextMessage = dashboardContext
      ? `\n\n[LIVE DATA]\n${JSON.stringify(dashboardContext, null, 2)}`
      : "";

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
            { role: "system", content: SYSTEM_PROMPT + contextMessage },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
