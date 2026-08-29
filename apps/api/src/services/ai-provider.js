function trimJson(value) {
  const text = String(value ?? "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text;
}

export function createAiProvider({ config, logger }) {
  const isOllama = config.aiProvider === "ollama";
  const enabled = config.aiProvider !== "heuristic" && Boolean(config.aiApiKey || isOllama);

  return {
    enabled,
    async classifyJob(job, profile) {
      if (!enabled) return null;

      const response = await fetch(`${config.aiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${config.aiApiKey || "ollama"}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: config.aiModel,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Return only JSON with fitScore (0-100), reasons (array), gaps (array). Never invent facts." },
            { role: "user", content: JSON.stringify({ job, profile: { headline: profile.headline, skills: profile.skills, targets: profile.careerTargets } }) }
          ]
        })
      });

      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const payload = await response.json();
      const parsed = JSON.parse(trimJson(payload.choices?.[0]?.message?.content));
      logger.info("AI job classification completed.", { model: config.aiModel });
      return {
        fitScore: Math.min(Math.max(Number(parsed.fitScore) || 0, 0), 100),
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons.slice(0, 5) : [],
        gaps: Array.isArray(parsed.gaps) ? parsed.gaps.slice(0, 5) : []
      };
    }
  };
}
