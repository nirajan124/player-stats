import { useState, useMemo } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

export default function PlayerFuturePrediction({ players, onClose }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [predictionYears, setPredictionYears] = useState(5);

  // Predict future performance based on career history
  const predictFuture = (player, years = 5) => {
    if (!player.careerHistory || player.careerHistory.length < 2) {
      return null;
    }

    const history = [...player.careerHistory].reverse(); // Most recent first
    const currentAge = player.age;
    
    // Calculate trends
    const ppgTrend = calculateTrend(history.map(h => h.ppg));
    const rpgTrend = calculateTrend(history.map(h => h.rpg));
    const apgTrend = calculateTrend(history.map(h => h.apg));

    // Age decline factor (performance typically declines after 30, more after 35)
    const getAgeFactor = (age, year) => {
      const futureAge = age + year;
      if (futureAge <= 28) return 1.0; // Peak
      if (futureAge <= 32) return 0.98; // Slight decline
      if (futureAge <= 35) return 0.95; // Moderate decline
      if (futureAge <= 38) return 0.90; // Significant decline
      return 0.85; // Major decline
    };

    // Generate predictions for next N years
    const predictions = [];
    for (let year = 1; year <= years; year++) {
      const ageFactor = getAgeFactor(currentAge, year);
      const season = `${2024 + year}-${String(2025 + year).slice(2)}`;
      
      predictions.push({
        season,
        year: year,
        age: currentAge + year,
        predictedPPG: Math.max(0, (player.pointsPerGame + ppgTrend * year) * ageFactor),
        predictedRPG: Math.max(0, (player.reboundsPerGame + rpgTrend * year) * ageFactor),
        predictedAPG: Math.max(0, (player.assistsPerGame + apgTrend * year) * ageFactor),
        confidence: calculateConfidence(player, year),
      });
    }

    // Predict career milestones
    const currentPPG = player.pointsPerGame;
    const currentRPG = player.reboundsPerGame;
    const currentAPG = player.assistsPerGame;
    const gamesPerSeason = 70; // Average games per season

    const projectedCareerPoints = player.careerPoints + 
      predictions.reduce((sum, p) => sum + (p.predictedPPG * gamesPerSeason), 0);
    const projectedCareerRebounds = player.careerRebounds + 
      predictions.reduce((sum, p) => sum + (p.predictedRPG * gamesPerSeason), 0);
    const projectedCareerAssists = player.careerAssists + 
      predictions.reduce((sum, p) => sum + (p.predictedAPG * gamesPerSeason), 0);

    return {
      predictions,
      projectedCareerPoints,
      projectedCareerRebounds,
      projectedCareerAssists,
      trend: {
        ppg: ppgTrend,
        rpg: rpgTrend,
        apg: apgTrend,
      },
    };
  };

  const calculateTrend = (values) => {
    if (values.length < 2) return 0;
    // Simple linear regression slope
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + (idx + 1) * val, 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  };

  const calculateConfidence = (player, year) => {
    const historyLength = player.careerHistory?.length || 0;
    const experience = player.yearsInLeague;
    const age = player.age + year;
    
    // More history = higher confidence
    const historyScore = Math.min(1, historyLength / 5);
    // More experience = higher confidence
    const experienceScore = Math.min(1, experience / 10);
    // Younger players = higher confidence for future
    const ageScore = age < 35 ? 1 : age < 38 ? 0.8 : 0.6;
    
    return (historyScore * 0.4 + experienceScore * 0.3 + ageScore * 0.3);
  };

  const futureData = useMemo(() => {
    if (!selectedPlayer) return null;
    return predictFuture(selectedPlayer, predictionYears);
  }, [selectedPlayer, predictionYears]);

  // Chart data for future predictions
  const predictionChartData = useMemo(() => {
    if (!futureData || !selectedPlayer) return null;

    const history = selectedPlayer.careerHistory ? [...selectedPlayer.careerHistory].reverse() : [];
    const historyLabels = history.map(h => h.season);
    const historyPPG = history.map(h => h.ppg);
    const historyRPG = history.map(h => h.rpg);
    const historyAPG = history.map(h => h.apg);

    const predictionLabels = futureData.predictions.map(p => p.season);
    const predictionPPG = futureData.predictions.map(p => p.predictedPPG);
    const predictionRPG = futureData.predictions.map(p => p.predictedRPG);
    const predictionAPG = futureData.predictions.map(p => p.predictedAPG);

    return {
      labels: [...historyLabels, ...predictionLabels],
      datasets: [
        {
          label: "Points Per Game (Historical)",
          data: [...historyPPG, ...new Array(predictionLabels.length).fill(null)],
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          borderDash: [],
        },
        {
          label: "Points Per Game (Predicted)",
          data: [...new Array(historyLabels.length).fill(null), ...predictionPPG],
          borderColor: "rgba(239, 68, 68, 0.5)",
          backgroundColor: "rgba(239, 68, 68, 0.05)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: "Rebounds Per Game (Historical)",
          data: [...historyRPG, ...new Array(predictionLabels.length).fill(null)],
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          borderDash: [],
        },
        {
          label: "Rebounds Per Game (Predicted)",
          data: [...new Array(historyLabels.length).fill(null), ...predictionRPG],
          borderColor: "rgba(59, 130, 246, 0.5)",
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: "Assists Per Game (Historical)",
          data: [...historyAPG, ...new Array(predictionLabels.length).fill(null)],
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderWidth: 2,
          borderDash: [],
        },
        {
          label: "Assists Per Game (Predicted)",
          data: [...new Array(historyLabels.length).fill(null), ...predictionAPG],
          borderColor: "rgba(34, 197, 94, 0.5)",
          backgroundColor: "rgba(34, 197, 94, 0.05)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    };
  }, [selectedPlayer, futureData]);

  const nextSeasonComparison = useMemo(() => {
    if (!futureData || !selectedPlayer) return null;

    const nextSeason = futureData.predictions[0];
    return {
      labels: ["Current Season", "Next Season (Predicted)"],
      datasets: [
        {
          label: "Points Per Game",
          data: [selectedPlayer.pointsPerGame, nextSeason.predictedPPG],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
        },
        {
          label: "Rebounds Per Game",
          data: [selectedPlayer.reboundsPerGame, nextSeason.predictedRPG],
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
        {
          label: "Assists Per Game",
          data: [selectedPlayer.assistsPerGame, nextSeason.predictedAPG],
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedPlayer, futureData]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">🔮 Player Future Prediction</h2>
            <p className="text-indigo-100">Predict future performance based on career history and trends</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Player Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Player
            </label>
            <select
              value={selectedPlayer?.id || ""}
              onChange={(e) => {
                const player = players.find(p => p.id === parseInt(e.target.value));
                setSelectedPlayer(player || null);
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a player...</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.team} ({p.position})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prediction Years
            </label>
            <select
              value={predictionYears}
              onChange={(e) => setPredictionYears(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
              <option value={7}>7 Years</option>
              <option value={10}>10 Years</option>
            </select>
          </div>
        </div>
      </div>

      {selectedPlayer && futureData && (
        <div className="space-y-6">
          {/* Next Season Prediction */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              📊 Next Season Prediction ({futureData.predictions[0].season})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg border-2 border-red-300 dark:border-red-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points Per Game</p>
                  <span className="text-xs bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
                    {(futureData.predictions[0].confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {futureData.predictions[0].predictedPPG.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    (Current: {selectedPlayer.pointsPerGame.toFixed(1)})
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Change: {((futureData.predictions[0].predictedPPG - selectedPlayer.pointsPerGame) / selectedPlayer.pointsPerGame * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rebounds Per Game</p>
                  <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
                    {(futureData.predictions[0].confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {futureData.predictions[0].predictedRPG.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    (Current: {selectedPlayer.reboundsPerGame.toFixed(1)})
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Change: {((futureData.predictions[0].predictedRPG - selectedPlayer.reboundsPerGame) / selectedPlayer.reboundsPerGame * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg border-2 border-green-300 dark:border-green-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assists Per Game</p>
                  <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded">
                    {(futureData.predictions[0].confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {futureData.predictions[0].predictedAPG.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    (Current: {selectedPlayer.assistsPerGame.toFixed(1)})
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Change: {((futureData.predictions[0].predictedAPG - selectedPlayer.assistsPerGame) / selectedPlayer.assistsPerGame * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Next Season Comparison Chart */}
            {nextSeasonComparison && (
              <div className="h-80">
                <Bar
                  data={nextSeasonComparison}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Long-term Prediction Chart */}
          {predictionChartData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                📈 {predictionYears}-Year Performance Projection
              </h3>
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Solid lines show historical data, dashed lines show predictions. 
                  Predictions account for age-related decline and career trends.
                </p>
              </div>
              <div className="h-96">
                <Line
                  data={predictionChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Career Milestones */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              🎯 Projected Career Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Career Points</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {futureData.projectedCareerPoints.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Current: {selectedPlayer.careerPoints.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{(futureData.projectedCareerPoints - selectedPlayer.careerPoints).toLocaleString()} projected
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Career Rebounds</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {futureData.projectedCareerRebounds.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Current: {selectedPlayer.careerRebounds.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{(futureData.projectedCareerRebounds - selectedPlayer.careerRebounds).toLocaleString()} projected
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-green-300 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Career Assists</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {futureData.projectedCareerAssists.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Current: {selectedPlayer.careerAssists.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{(futureData.projectedCareerAssists - selectedPlayer.careerAssists).toLocaleString()} projected
                </p>
              </div>
            </div>
          </div>

          {/* Year-by-Year Predictions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              📅 Year-by-Year Predictions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-gray-700 dark:text-gray-300">Season</th>
                    <th className="text-left p-3 text-gray-700 dark:text-gray-300">Age</th>
                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">PPG</th>
                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">RPG</th>
                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">APG</th>
                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {futureData.predictions.map((pred, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-3 font-semibold text-gray-800 dark:text-white">
                        {pred.season}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{pred.age}</td>
                      <td className="p-3 text-right font-bold text-red-600 dark:text-red-400">
                        {pred.predictedPPG.toFixed(1)}
                      </td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                        {pred.predictedRPG.toFixed(1)}
                      </td>
                      <td className="p-3 text-right font-bold text-green-600 dark:text-green-400">
                        {pred.predictedAPG.toFixed(1)}
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                          {(pred.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Trend Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              📉 Performance Trend Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Points Trend</p>
                <p className={`text-2xl font-bold ${
                  futureData.trend.ppg > 0 ? "text-green-600 dark:text-green-400" : 
                  futureData.trend.ppg < 0 ? "text-red-600 dark:text-red-400" : 
                  "text-gray-600 dark:text-gray-400"
                }`}>
                  {futureData.trend.ppg > 0 ? "↑" : futureData.trend.ppg < 0 ? "↓" : "→"} 
                  {Math.abs(futureData.trend.ppg).toFixed(2)} per season
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rebounds Trend</p>
                <p className={`text-2xl font-bold ${
                  futureData.trend.rpg > 0 ? "text-green-600 dark:text-green-400" : 
                  futureData.trend.rpg < 0 ? "text-red-600 dark:text-red-400" : 
                  "text-gray-600 dark:text-gray-400"
                }`}>
                  {futureData.trend.rpg > 0 ? "↑" : futureData.trend.rpg < 0 ? "↓" : "→"} 
                  {Math.abs(futureData.trend.rpg).toFixed(2)} per season
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Assists Trend</p>
                <p className={`text-2xl font-bold ${
                  futureData.trend.apg > 0 ? "text-green-600 dark:text-green-400" : 
                  futureData.trend.apg < 0 ? "text-red-600 dark:text-red-400" : 
                  "text-gray-600 dark:text-gray-400"
                }`}>
                  {futureData.trend.apg > 0 ? "↑" : futureData.trend.apg < 0 ? "↓" : "→"} 
                  {Math.abs(futureData.trend.apg).toFixed(2)} per season
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedPlayer && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Select a player to see future predictions
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Predictions are based on career history, age, and performance trends
          </p>
        </div>
      )}
    </div>
  );
}

