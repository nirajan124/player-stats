import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function TeamStatistics({ players }) {
  // Group players by team
  const teamStats = players.reduce((acc, player) => {
    if (!acc[player.team]) {
      acc[player.team] = {
        name: player.team,
        players: [],
        totalPPG: 0,
        totalRPG: 0,
        totalAPG: 0,
        avgPER: 0,
        championships: 0,
      };
    }
    acc[player.team].players.push(player);
    acc[player.team].totalPPG += player.pointsPerGame;
    acc[player.team].totalRPG += player.reboundsPerGame;
    acc[player.team].totalAPG += player.assistsPerGame;
    acc[player.team].championships += player.championships;
    return acc;
  }, {});

  const teams = Object.values(teamStats).map((team) => ({
    ...team,
    avgPPG: team.totalPPG / team.players.length,
    avgRPG: team.totalRPG / team.players.length,
    avgAPG: team.totalAPG / team.players.length,
    avgPER: team.players.reduce((sum, p) => sum + p.playerEfficiencyRating, 0) / team.players.length,
  }));

  const barData = {
    labels: teams.map((t) => t.name),
    datasets: [
      {
        label: "Average PPG",
        data: teams.map((t) => t.avgPPG),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
      {
        label: "Average RPG",
        data: teams.map((t) => t.avgRPG),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "Average APG",
        data: teams.map((t) => t.avgAPG),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: teams.map((t) => t.name),
    datasets: [
      {
        data: teams.map((t) => t.players.length),
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">🏀 Team Statistics</h2>
        <p className="text-blue-100">Team performance analysis and comparisons</p>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{team.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Players:</span>
                <span className="font-bold text-gray-800 dark:text-white">{team.players.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg PPG:</span>
                <span className="font-bold text-red-600">{team.avgPPG.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg RPG:</span>
                <span className="font-bold text-blue-600">{team.avgRPG.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg APG:</span>
                <span className="font-bold text-green-600">{team.avgAPG.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg PER:</span>
                <span className="font-bold text-purple-600">{team.avgPER.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Championships:</span>
                <span className="font-bold text-yellow-600">{team.championships}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Team Performance Comparison</h3>
          <div className="h-80">
            <Bar data={barData} options={options} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Players per Team</h3>
          <div className="h-80">
            <Doughnut data={doughnutData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}


