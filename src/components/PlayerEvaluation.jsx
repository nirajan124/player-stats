import { Radar, Bar } from "react-chartjs-2";
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

export default function PlayerEvaluation({ player, allPlayers }) {
  if (!player) return null;

  // Calculate overall rating
  const calculateOverallRating = () => {
    const scoring = (player.pointsPerGame / 35) * 100;
    const rebounding = (player.reboundsPerGame / 15) * 100;
    const playmaking = (player.assistsPerGame / 12) * 100;
    const defense = ((player.stealsPerGame + player.blocksPerGame) / 3) * 100;
    const efficiency = (player.playerEfficiencyRating / 35) * 100;
    const shooting = (player.fieldGoalPercentage + player.threePointPercentage) / 2;

    return (scoring + rebounding + playmaking + defense + efficiency + shooting) / 6;
  };

  const overallRating = calculateOverallRating();

  // Get percentile rankings
  const getPercentile = (stat, getValue) => {
    const sorted = [...allPlayers].sort((a, b) => getValue(b) - getValue(a));
    const rank = sorted.findIndex((p) => p.id === player.id) + 1;
    return ((allPlayers.length - rank) / allPlayers.length) * 100;
  };

  const radarData = {
    labels: ["Scoring", "Rebounding", "Playmaking", "Defense", "Efficiency", "Shooting"],
    datasets: [
      {
        label: player.name,
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
      },
      {
        label: "League Average",
        data: [50, 50, 50, 50, 50, 50],
        backgroundColor: "rgba(200, 200, 200, 0.1)",
        borderColor: "rgba(200, 200, 200, 0.5)",
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const percentileData = {
    labels: ["PPG", "RPG", "APG", "PER", "FG%"],
    datasets: [
      {
        label: "Percentile Ranking",
        data: [
          getPercentile("ppg", (p) => p.pointsPerGame),
          getPercentile("rpg", (p) => p.reboundsPerGame),
          getPercentile("apg", (p) => p.assistsPerGame),
          getPercentile("per", (p) => p.playerEfficiencyRating),
          getPercentile("fg", (p) => p.fieldGoalPercentage),
        ],
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return "text-green-600";
    if (rating >= 60) return "text-blue-600";
    if (rating >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 90) return "Elite";
    if (rating >= 80) return "All-Star";
    if (rating >= 70) return "Starter";
    if (rating >= 60) return "Role Player";
    return "Bench";
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">📊 Player Evaluation</h2>
        <p className="text-green-100">Comprehensive performance analysis for {player.name}</p>
      </div>

      {/* Overall Rating */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Rating</p>
          <div className="relative inline-block">
            <div className="text-8xl font-bold mb-2">
              <span className={getRatingColor(overallRating)}>{overallRating.toFixed(0)}</span>
              <span className="text-4xl text-gray-400">/100</span>
            </div>
            <div className={`text-2xl font-semibold ${getRatingColor(overallRating)}`}>
              {getRatingLabel(overallRating)}
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                overallRating >= 80
                  ? "bg-green-500"
                  : overallRating >= 60
                  ? "bg-blue-500"
                  : overallRating >= 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${overallRating}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Percentile Rankings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Percentile Rankings</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "PPG", value: getPercentile("ppg", (p) => p.pointsPerGame) },
            { label: "RPG", value: getPercentile("rpg", (p) => p.reboundsPerGame) },
            { label: "APG", value: getPercentile("apg", (p) => p.assistsPerGame) },
            { label: "PER", value: getPercentile("per", (p) => p.playerEfficiencyRating) },
            { label: "FG%", value: getPercentile("fg", (p) => p.fieldGoalPercentage) },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Percentile</p>
            </div>
          ))}
        </div>
        <div className="h-64">
          <Bar data={percentileData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Performance vs League Average</h3>
        <div className="h-96">
          <Radar
            data={radarData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg p-6 border-2 border-green-300 dark:border-green-700">
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">✅ Strengths</h3>
          <ul className="space-y-2">
            {[
              player.pointsPerGame > 25 && "Elite scoring ability",
              player.reboundsPerGame > 10 && "Strong rebounding",
              player.assistsPerGame > 7 && "Excellent playmaking",
              player.playerEfficiencyRating > 25 && "High efficiency rating",
              player.fieldGoalPercentage > 50 && "Accurate shooting",
            ]
              .filter(Boolean)
              .map((strength, idx) => (
                <li key={idx} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span>✓</span>
                  <span>{strength}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow-lg p-6 border-2 border-red-300 dark:border-red-700">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">⚠️ Areas for Improvement</h3>
          <ul className="space-y-2">
            {[
              player.reboundsPerGame < 5 && "Rebounding",
              player.assistsPerGame < 4 && "Playmaking",
              player.threePointPercentage < 35 && "Three-point shooting",
              player.stealsPerGame < 1 && "Defensive activity",
            ]
              .filter(Boolean)
              .map((area, idx) => (
                <li key={idx} className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <span>→</span>
                  <span>{area}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


