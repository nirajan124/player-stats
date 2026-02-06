// AI/ML Prediction Functions
// Using statistical models to predict player performance

/**
 * Predicts next season performance based on career trends
 */
export function predictNextSeason(player) {
  const history = player.careerHistory || [];
  if (history.length < 2) return null;

  // Simple linear regression for trend prediction
  const recentSeasons = history.slice(0, 3);
  const ppgTrend = calculateTrend(recentSeasons.map(s => s.ppg));
  const rpgTrend = calculateTrend(recentSeasons.map(s => s.rpg));
  const apgTrend = calculateTrend(recentSeasons.map(s => s.apg));

  // Account for age decline (performance typically peaks around 27-29)
  const ageFactor = player.age > 32 ? 0.95 : player.age > 29 ? 0.98 : 1.0;

  return {
    predictedPPG: Math.max(0, (player.pointsPerGame + ppgTrend) * ageFactor),
    predictedRPG: Math.max(0, (player.reboundsPerGame + rpgTrend) * ageFactor),
    predictedAPG: Math.max(0, (player.assistsPerGame + apgTrend) * ageFactor),
    confidence: calculateConfidence(history.length, player.yearsInLeague)
  };
}

/**
 * Finds similar players based on statistical profile
 */
export function findSimilarPlayers(targetPlayer, allPlayers, limit = 5) {
  const similarities = allPlayers
    .filter(p => p.id !== targetPlayer.id)
    .map(player => ({
      player,
      similarity: calculateSimilarity(targetPlayer, player)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities;
}

/**
 * Predicts career trajectory and milestones
 */
export function predictCareerMilestones(player) {
  const currentPPG = player.pointsPerGame;
  const currentRPG = player.reboundsPerGame;
  const currentAPG = player.assistsPerGame;
  const gamesPerSeason = 70; // Average games per season
  const yearsRemaining = Math.max(0, 40 - player.age); // Assuming retirement around 40

  // Projected career totals
  const projectedPoints = player.careerPoints + (currentPPG * gamesPerSeason * yearsRemaining * 0.9);
  const projectedRebounds = player.careerRebounds + (currentRPG * gamesPerSeason * yearsRemaining * 0.9);
  const projectedAssists = player.careerAssists + (currentAPG * gamesPerSeason * yearsRemaining * 0.9);

  // Milestone predictions
  const milestones = [];
  if (projectedPoints >= 30000 && player.careerPoints < 30000) {
    milestones.push({ type: "30,000 Points", probability: 0.85 });
  }
  if (projectedPoints >= 40000 && player.careerPoints < 40000) {
    milestones.push({ type: "40,000 Points", probability: 0.45 });
  }
  if (projectedRebounds >= 10000 && player.careerRebounds < 10000) {
    milestones.push({ type: "10,000 Rebounds", probability: 0.70 });
  }
  if (projectedAssists >= 10000 && player.careerAssists < 10000) {
    milestones.push({ type: "10,000 Assists", probability: 0.60 });
  }

  return {
    projectedPoints: Math.round(projectedPoints),
    projectedRebounds: Math.round(projectedRebounds),
    projectedAssists: Math.round(projectedAssists),
    milestones
  };
}

/**
 * Calculates performance trend (positive or negative)
 */
function calculateTrend(values) {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const recent = values[0];
  return recent - avg;
}

/**
 * Calculates similarity score between two players (0-1)
 */
function calculateSimilarity(player1, player2) {
  const weights = {
    pointsPerGame: 0.25,
    reboundsPerGame: 0.20,
    assistsPerGame: 0.20,
    fieldGoalPercentage: 0.15,
    playerEfficiencyRating: 0.20
  };

  let similarity = 0;
  let totalWeight = 0;

  for (const [metric, weight] of Object.entries(weights)) {
    const maxValue = Math.max(player1[metric], player2[metric], 1);
    const diff = Math.abs(player1[metric] - player2[metric]) / maxValue;
    similarity += (1 - diff) * weight;
    totalWeight += weight;
  }

  return similarity / totalWeight;
}

/**
 * Calculates prediction confidence (0-1)
 */
function calculateConfidence(historyLength, yearsInLeague) {
  const historyScore = Math.min(historyLength / 5, 1);
  const experienceScore = Math.min(yearsInLeague / 10, 1);
  return (historyScore * 0.6 + experienceScore * 0.4);
}

/**
 * Predicts MVP probability based on current performance
 */
export function predictMVPProbability(player, allPlayers) {
  const topPerformers = allPlayers
    .sort((a, b) => b.playerEfficiencyRating - a.playerEfficiencyRating)
    .slice(0, 10);

  const rank = topPerformers.findIndex(p => p.id === player.id) + 1;
  if (rank === 0) return 0.05;

  // Higher PER = higher MVP chance
  const perScore = player.playerEfficiencyRating / 35; // Normalize to 0-1
  const rankScore = (11 - rank) / 10;
  const teamSuccess = 0.7; // Assume good team performance

  return Math.min(0.95, (perScore * 0.4 + rankScore * 0.4 + teamSuccess * 0.2));
}

/**
 * Analyzes performance trends over time
 */
export function analyzePerformanceTrend(player) {
  const history = player.careerHistory || [];
  if (history.length < 2) return { trend: "stable", description: "Insufficient data" };

  const recentPPG = history[0]?.ppg || player.pointsPerGame;
  const olderPPG = history[history.length - 1]?.ppg || player.pointsPerGame;
  const change = recentPPG - olderPPG;

  if (change > 3) {
    return { trend: "improving", description: "Significant improvement in scoring", change };
  } else if (change > 1) {
    return { trend: "slight_improvement", description: "Slight improvement in performance", change };
  } else if (change < -3) {
    return { trend: "declining", description: "Performance decline detected", change };
  } else if (change < -1) {
    return { trend: "slight_decline", description: "Slight decline in performance", change };
  } else {
    return { trend: "stable", description: "Consistent performance", change };
  }
}

