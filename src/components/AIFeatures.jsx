import { predictNextSeason, findSimilarPlayers, predictCareerMilestones, predictMVPProbability, analyzePerformanceTrend } from "../utils/aiPredictions";

export default function AIFeatures({ player, allPlayers }) {
  const nextSeason = predictNextSeason(player);
  const similarPlayers = findSimilarPlayers(player, allPlayers, 5);
  const milestones = predictCareerMilestones(player);
  const mvpProbability = predictMVPProbability(player, allPlayers);
  const trend = analyzePerformanceTrend(player);

  const trendColors = {
    improving: "text-green-600 bg-green-50",
    slight_improvement: "text-green-500 bg-green-50",
    stable: "text-blue-600 bg-blue-50",
    slight_decline: "text-yellow-600 bg-yellow-50",
    declining: "text-red-600 bg-red-50",
  };

  return (
    <div className="space-y-6">
      {/* AI Predictions Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">🤖 AI-Powered Analytics</h2>
        <p className="text-purple-100">Machine Learning Predictions & Insights</p>
      </div>

      {/* Performance Trend */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Performance Trend Analysis</h3>
        <div className={`inline-block px-4 py-2 rounded-lg ${trendColors[trend.trend]}`}>
          <p className="font-semibold">{trend.description}</p>
          {trend.change && (
            <p className="text-sm mt-1">
              {trend.change > 0 ? "+" : ""}{trend.change.toFixed(1)} PPG change
            </p>
          )}
        </div>
      </div>

      {/* Next Season Prediction */}
      {nextSeason && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Next Season Prediction</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Predicted PPG</p>
              <p className="text-2xl font-bold text-red-600">
                {nextSeason.predictedPPG.toFixed(1)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Predicted RPG</p>
              <p className="text-2xl font-bold text-blue-600">
                {nextSeason.predictedRPG.toFixed(1)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Predicted APG</p>
              <p className="text-2xl font-bold text-green-600">
                {nextSeason.predictedAPG.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Confidence: <span className="font-semibold">{(nextSeason.confidence * 100).toFixed(0)}%</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${nextSeason.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Career Milestones */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Career Milestone Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
            <p className="text-sm text-gray-600 mb-1">Projected Career Points</p>
            <p className="text-2xl font-bold text-yellow-700">
              {milestones.projectedPoints.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-300">
            <p className="text-sm text-gray-600 mb-1">Projected Career Rebounds</p>
            <p className="text-2xl font-bold text-blue-700">
              {milestones.projectedRebounds.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-300">
            <p className="text-sm text-gray-600 mb-1">Projected Career Assists</p>
            <p className="text-2xl font-bold text-green-700">
              {milestones.projectedAssists.toLocaleString()}
            </p>
          </div>
        </div>
        {milestones.milestones.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Upcoming Milestones:</p>
            <div className="space-y-2">
              {milestones.milestones.map((milestone, idx) => (
                <div key={idx} className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                  <span className="font-semibold text-purple-800">{milestone.type}</span>
                  <span className="text-sm text-gray-600">
                    {(milestone.probability * 100).toFixed(0)}% probability
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MVP Probability */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🏆 MVP Probability</h3>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Chance of Winning MVP</span>
            <span className="text-3xl font-bold text-yellow-700">
              {(mvpProbability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-yellow-300 rounded-full h-4">
            <div
              className="bg-yellow-600 h-4 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${mvpProbability * 100}%` }}
            >
              <span className="text-xs text-white font-semibold">
                {(mvpProbability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Players */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Similar Players (AI Analysis)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Players with similar statistical profiles based on machine learning analysis
        </p>
        <div className="space-y-3">
          {similarPlayers.map(({ player: similarPlayer, similarity }, idx) => (
            <div
              key={similarPlayer.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-800">{similarPlayer.name}</p>
                <p className="text-sm text-gray-600">
                  {similarPlayer.team} • {similarPlayer.position}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {(similarity * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">Similarity</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

