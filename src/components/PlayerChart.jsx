import { Bar, Line, Radar, Doughnut } from "react-chartjs-2";
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
  ArcElement,
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
  RadialLinearScale,
  ArcElement
);

export default function PlayerChart({ player, careerHistory }) {
  const barData = {
    labels: ["Points", "Rebounds", "Assists", "Steals", "Blocks"],
    datasets: [
      {
        label: `${player.name} - Current Season`,
        data: [
          player.pointsPerGame,
          player.reboundsPerGame,
          player.assistsPerGame,
          player.stealsPerGame,
          player.blocksPerGame,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Career History Line Chart
  const history = careerHistory || player.careerHistory || [];
  const lineData = {
    labels: history.map((h) => h.season).reverse(),
    datasets: [
      {
        label: "Points Per Game",
        data: history.map((h) => h.ppg).reverse(),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Rebounds Per Game",
        data: history.map((h) => h.rpg).reverse(),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Assists Per Game",
        data: history.map((h) => h.apg).reverse(),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Radar Chart for Complete Profile
  const radarData = {
    labels: ["Scoring", "Rebounding", "Playmaking", "Defense", "Efficiency", "Shooting"],
    datasets: [
      {
        label: `${player.name}`,
        data: [
          (player.pointsPerGame / 35) * 100,
          (player.reboundsPerGame / 15) * 100,
          (player.assistsPerGame / 12) * 100,
          ((player.stealsPerGame + player.blocksPerGame) / 3) * 100,
          (player.playerEfficiencyRating / 35) * 100,
          ((player.fieldGoalPercentage + player.threePointPercentage) / 2),
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  // Shooting Percentages Doughnut Chart
  const shootingData = {
    labels: ["Field Goals", "3-Pointers", "Free Throws"],
    datasets: [
      {
        data: [
          player.fieldGoalPercentage,
          player.threePointPercentage,
          player.freeThrowPercentage,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  };

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">{player.name}</h2>
            <p className="text-blue-100 text-lg">{player.team} • {player.position}</p>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-sm text-blue-100">Career Points</p>
                <p className="text-2xl font-bold">{player.careerPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-blue-100">Career Games</p>
                <p className="text-2xl font-bold">{player.careerGames}</p>
              </div>
              <div>
                <p className="text-sm text-blue-100">Years in League</p>
                <p className="text-2xl font-bold">{player.yearsInLeague}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100">Player Efficiency</p>
              <p className="text-4xl font-bold">{player.playerEfficiencyRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Points/Game</p>
          <p className="text-2xl font-bold text-red-600">{player.pointsPerGame}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Rebounds/Game</p>
          <p className="text-2xl font-bold text-blue-600">{player.reboundsPerGame}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Assists/Game</p>
          <p className="text-2xl font-bold text-green-600">{player.assistsPerGame}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Steals + Blocks</p>
          <p className="text-2xl font-bold text-purple-600">
            {(player.stealsPerGame + player.blocksPerGame).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Season Statistics</h3>
          <div className="h-64">
            <Bar data={barData} options={{ ...chartOptions, title: { display: false } }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Shooting Percentages</h3>
          <div className="h-64">
            <Doughnut data={shootingData} options={{ ...chartOptions, title: { display: false } }} />
          </div>
        </div>
      </div>

      {/* Career History */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Career Performance Trends</h3>
          <div className="h-80">
            <Line data={lineData} options={{ ...chartOptions, title: { display: false } }} />
          </div>
        </div>
      )}

      {/* Radar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Complete Player Profile</h3>
        <div className="h-96">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
}
