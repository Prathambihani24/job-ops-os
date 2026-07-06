function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function scoreOpportunity(input) {
  const {
    companyStage = "unknown",
    hasOpenRole = false,
    recentNewsCount = 0,
    founderActivityScore = 0,
    techFitScore = 0,
    personalizationDepthScore = 0
  } = input;

  const stageWeight =
    companyStage === "Series A" || companyStage === "Series B"
      ? 20
      : companyStage === "Seed"
        ? 15
        : 8;

  const hiringWeight = hasOpenRole ? 25 : 10;
  const newsWeight = clamp(recentNewsCount * 4, 0, 20);
  const founderWeight = clamp(founderActivityScore, 0, 15);
  const techWeight = clamp(techFitScore, 0, 10);
  const personalizationWeight = clamp(personalizationDepthScore, 0, 10);

  const totalScore =
    stageWeight +
    hiringWeight +
    newsWeight +
    founderWeight +
    techWeight +
    personalizationWeight;

  let recommendation = "deprioritize";

  if (totalScore >= 75) {
    recommendation = "prioritize";
  } else if (totalScore >= 55) {
    recommendation = "monitor";
  }

  return {
    score: totalScore,
    recommendation,
    breakdown: {
      stageWeight,
      hiringWeight,
      newsWeight,
      founderWeight,
      techWeight,
      personalizationWeight
    }
  };
}

