import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CareerTimeline({ player }) {
  if (!player || !player.careerHistory) return null;

  const history = [...player.careerHistory].reverse();

  const timelineData = {
    labels: history.map((h) => h.season),
    datasets: [
      {
        label: "Points Per Game",
        data: history.map((h) => h.ppg),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Rebounds Per Game",
        data: history.map((h) => h.rpg),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Assists Per Game",
        data: history.map((h) => h.apg),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
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
      title: {
        display: true,
        text: `${player.name} - Career Performance Timeline`,
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">📅 Career Timeline</h3>
      <div className="h-96">
        <Line data={timelineData} options={options} />
      </div>
      
      {/* Career Milestones */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
          <p className="text-sm text-gray-600 mb-1">Career Points</p>
          <p className="text-2xl font-bold text-yellow-700">{player.careerPoints.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-300">
          <p className="text-sm text-gray-600 mb-1">Career Rebounds</p>
          <p className="text-2xl font-bold text-blue-700">{player.careerRebounds.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-300">
          <p className="text-sm text-gray-600 mb-1">Career Assists</p>
          <p className="text-2xl font-bold text-green-700">{player.careerAssists.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-300">
          <p className="text-sm text-gray-600 mb-1">Games Played</p>
          <p className="text-2xl font-bold text-purple-700">{player.careerGames.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

