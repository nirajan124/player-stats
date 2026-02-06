import { Doughnut, Bar } from "react-chartjs-2";

export default function AdvancedStats({ player }) {
  if (!player) return null;

  // Calculate advanced metrics
  const trueShootingPercentage = (
    (player.pointsPerGame / (2 * (player.fieldGoalPercentage / 100 * player.pointsPerGame / 2.2) + 0.44 * (player.freeThrowPercentage / 100 * player.pointsPerGame * 0.3))) * 100
  ).toFixed(1);

  const usageRate = ((player.pointsPerGame + player.assistsPerGame * 2) / 100).toFixed(1);
  const winShares = (player.playerEfficiencyRating * player.games / 100).toFixed(1);

  const efficiencyData = {
    labels: ["Offensive", "Defensive", "Playmaking"],
    datasets: [
      {
        data: [
          player.pointsPerGame * 2,
          (player.reboundsPerGame + player.stealsPerGame + player.blocksPerGame) * 2,
          player.assistsPerGame * 3,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const shootingData = {
    labels: ["2PT Made", "3PT Made", "FT Made"],
    datasets: [
      {
        data: [
          player.fieldGoalPercentage * 0.7,
          player.threePointPercentage * 0.3,
          player.freeThrowPercentage * 0.2,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(251, 191, 36, 0.7)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(251, 191, 36, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">📈 Advanced Statistics</h2>
        <p className="text-purple-100">Deep dive into player performance metrics</p>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">True Shooting %</p>
          <p className="text-2xl font-bold text-blue-600">{trueShootingPercentage}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Usage Rate</p>
          <p className="text-2xl font-bold text-green-600">{usageRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Win Shares</p>
          <p className="text-2xl font-bold text-purple-600">{winShares}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 mb-1">PER</p>
          <p className="text-2xl font-bold text-orange-600">{player.playerEfficiencyRating.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Efficiency Breakdown</h3>
          <div className="h-64">
            <Doughnut data={efficiencyData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Shooting Distribution</h3>
          <div className="h-64">
            <Doughnut data={shootingData} />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Performance Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Points/48min</p>
            <p className="text-2xl font-bold text-red-600">
              {(player.pointsPerGame * 1.5).toFixed(1)}
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Rebounds/48min</p>
            <p className="text-2xl font-bold text-blue-600">
              {(player.reboundsPerGame * 1.5).toFixed(1)}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Assists/48min</p>
            <p className="text-2xl font-bold text-green-600">
              {(player.assistsPerGame * 1.5).toFixed(1)}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Steals+Blocks</p>
            <p className="text-2xl font-bold text-purple-600">
              {(player.stealsPerGame + player.blocksPerGame).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

