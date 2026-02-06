import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

export default function PlayerComparison({ player1, player2 }) {
  if (!player1 || !player2) return null;

  // Comparison Bar Chart
  const comparisonData = {
    labels: ["PPG", "RPG", "APG", "SPG", "BPG", "PER"],
    datasets: [
      {
        label: player1.name,
        data: [
          player1.pointsPerGame,
          player1.reboundsPerGame,
          player1.assistsPerGame,
          player1.stealsPerGame,
          player1.blocksPerGame,
          player1.playerEfficiencyRating,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: player2.name,
        data: [
          player2.pointsPerGame,
          player2.reboundsPerGame,
          player2.assistsPerGame,
          player2.stealsPerGame,
          player2.blocksPerGame,
          player2.playerEfficiencyRating,
        ],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Radar Comparison
  const radarData = {
    labels: ["Scoring", "Rebounding", "Playmaking", "Defense", "Efficiency", "Shooting"],
    datasets: [
      {
        label: player1.name,
        data: [
          (player1.pointsPerGame / 35) * 100,
          (player1.reboundsPerGame / 15) * 100,
          (player1.assistsPerGame / 12) * 100,
          ((player1.stealsPerGame + player1.blocksPerGame) / 3) * 100,
          (player1.playerEfficiencyRating / 35) * 100,
          ((player1.fieldGoalPercentage + player1.threePointPercentage) / 2),
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: player2.name,
        data: [
          (player2.pointsPerGame / 35) * 100,
          (player2.reboundsPerGame / 15) * 100,
          (player2.assistsPerGame / 12) * 100,
          ((player2.stealsPerGame + player2.blocksPerGame) / 3) * 100,
          (player2.playerEfficiencyRating / 35) * 100,
          ((player2.fieldGoalPercentage + player2.threePointPercentage) / 2),
        ],
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
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
    },
  };

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Calculate advantages
  const getAdvantage = (stat1, stat2, statName) => {
    if (stat1 > stat2) {
      return { player: player1.name, advantage: ((stat1 - stat2) / stat2 * 100).toFixed(1) };
    } else if (stat2 > stat1) {
      return { player: player2.name, advantage: ((stat2 - stat1) / stat1 * 100).toFixed(1) };
    }
    return { player: "Tie", advantage: 0 };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">⚔️ Player Comparison</h2>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-xl font-semibold">{player1.name}</p>
            <p className="text-blue-100">{player1.team}</p>
          </div>
          <div className="text-4xl font-bold">VS</div>
          <div className="text-center">
            <p className="text-xl font-semibold">{player2.name}</p>
            <p className="text-red-100">{player2.team}</p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player 1 Stats */}
        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">{player1.name}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Points/Game:</span>
              <span className="font-bold text-blue-600">{player1.pointsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Rebounds/Game:</span>
              <span className="font-bold text-blue-600">{player1.reboundsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Assists/Game:</span>
              <span className="font-bold text-blue-600">{player1.assistsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">PER:</span>
              <span className="font-bold text-blue-600">{player1.playerEfficiencyRating.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">FG%:</span>
              <span className="font-bold text-blue-600">{player1.fieldGoalPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Career Points:</span>
              <span className="font-bold text-blue-600">{player1.careerPoints.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Championships:</span>
              <span className="font-bold text-blue-600">{player1.championships}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">MVP Awards:</span>
              <span className="font-bold text-blue-600">{player1.mvpAwards}</span>
            </div>
          </div>
        </div>

        {/* Player 2 Stats */}
        <div className="bg-red-50 p-6 rounded-xl border-2 border-red-300">
          <h3 className="text-2xl font-bold text-red-800 mb-4">{player2.name}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Points/Game:</span>
              <span className="font-bold text-red-600">{player2.pointsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Rebounds/Game:</span>
              <span className="font-bold text-red-600">{player2.reboundsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Assists/Game:</span>
              <span className="font-bold text-red-600">{player2.assistsPerGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">PER:</span>
              <span className="font-bold text-red-600">{player2.playerEfficiencyRating.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">FG%:</span>
              <span className="font-bold text-red-600">{player2.fieldGoalPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Career Points:</span>
              <span className="font-bold text-red-600">{player2.careerPoints.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Championships:</span>
              <span className="font-bold text-red-600">{player2.championships}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">MVP Awards:</span>
              <span className="font-bold text-red-600">{player2.mvpAwards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Statistical Advantages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Points", stat1: player1.pointsPerGame, stat2: player2.pointsPerGame },
            { name: "Rebounds", stat1: player1.reboundsPerGame, stat2: player2.reboundsPerGame },
            { name: "Assists", stat1: player1.assistsPerGame, stat2: player2.assistsPerGame },
            { name: "PER", stat1: player1.playerEfficiencyRating, stat2: player2.playerEfficiencyRating },
          ].map(({ name, stat1, stat2 }) => {
            const advantage = getAdvantage(stat1, stat2, name);
            return (
              <div key={name} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">{name}</p>
                <p className="font-bold text-gray-800">{advantage.player}</p>
                {advantage.advantage > 0 && (
                  <p className="text-sm text-green-600">+{advantage.advantage}%</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Statistical Comparison</h3>
          <div className="h-80">
            <Bar data={comparisonData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Profile Comparison</h3>
          <div className="h-80">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

