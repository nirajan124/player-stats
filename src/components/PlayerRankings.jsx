import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PlayerRankings({ players, category }) {
  const sortedPlayers = [...players]
    .sort((a, b) => {
      if (category === "points") return b.pointsPerGame - a.pointsPerGame;
      if (category === "rebounds") return b.reboundsPerGame - a.reboundsPerGame;
      if (category === "assists") return b.assistsPerGame - a.assistsPerGame;
      if (category === "per") return b.playerEfficiencyRating - a.playerEfficiencyRating;
      return 0;
    })
    .slice(0, 10);

  const getCategoryLabel = () => {
    if (category === "points") return "Points Per Game";
    if (category === "rebounds") return "Rebounds Per Game";
    if (category === "assists") return "Assists Per Game";
    if (category === "per") return "Player Efficiency Rating";
    return "Points Per Game";
  };

  const getCategoryValue = (player) => {
    if (category === "points") return player.pointsPerGame;
    if (category === "rebounds") return player.reboundsPerGame;
    if (category === "assists") return player.assistsPerGame;
    if (category === "per") return player.playerEfficiencyRating;
    return player.pointsPerGame;
  };

  const chartData = {
    labels: sortedPlayers.map((p) => p.name),
    datasets: [
      {
        label: getCategoryLabel(),
        data: sortedPlayers.map((p) => getCategoryValue(p)),
        backgroundColor: sortedPlayers.map((_, idx) => {
          if (idx === 0) return "rgba(255, 215, 0, 0.8)"; // Gold
          if (idx === 1) return "rgba(192, 192, 192, 0.8)"; // Silver
          if (idx === 2) return "rgba(205, 127, 50, 0.8)"; // Bronze
          return "rgba(59, 130, 246, 0.6)";
        }),
        borderColor: sortedPlayers.map((_, idx) => {
          if (idx === 0) return "rgba(255, 215, 0, 1)";
          if (idx === 1) return "rgba(192, 192, 192, 1)";
          if (idx === 2) return "rgba(205, 127, 50, 1)";
          return "rgba(59, 130, 246, 1)";
        }),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top 10 Players - ${getCategoryLabel()}`,
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">🏆 Player Rankings</h2>
        <p className="text-yellow-100">Top performers across different categories</p>
      </div>

      {/* Rankings List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-3">
          {sortedPlayers.map((player, idx) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                idx === 0
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 dark:from-yellow-900 dark:to-yellow-800 dark:border-yellow-700"
                  : idx === 1
                  ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600"
                  : idx === 2
                  ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 dark:from-orange-900 dark:to-orange-800 dark:border-orange-700"
                  : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : idx === 1
                      ? "bg-gray-300 text-gray-800"
                      : idx === 2
                      ? "bg-orange-400 text-orange-900"
                      : "bg-blue-400 text-blue-900"
                  }`}
                >
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-lg">{player.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{player.team} • {player.position}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {getCategoryValue(player).toFixed(category === "per" ? 1 : 1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{getCategoryLabel()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="h-96">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}


