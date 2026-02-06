import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Doughnut, Bar } from "react-chartjs-2";
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

export default function FormationBuilder({ players, onClose }) {
  const [formation, setFormation] = useState({
    PG: null, // Point Guard
    SG: null, // Shooting Guard
    SF: null, // Small Forward
    PF: null, // Power Forward
    C: null,  // Center
  });

  const [draggedPlayer, setDraggedPlayer] = useState(null);

  const handleDragStart = (player) => {
    setDraggedPlayer(player);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (position) => {
    if (draggedPlayer) {
      setFormation((prev) => ({
        ...prev,
        [position]: draggedPlayer,
      }));
      setDraggedPlayer(null);
    }
  };

  const removePlayer = (position) => {
    setFormation((prev) => ({
      ...prev,
      [position]: null,
    }));
  };

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const lineup = Object.values(formation).filter(Boolean);
    if (lineup.length === 0) return null;

    // Individual player stats
    const totalPPG = lineup.reduce((sum, p) => sum + p.pointsPerGame, 0);
    const totalRPG = lineup.reduce((sum, p) => sum + p.reboundsPerGame, 0);
    const totalAPG = lineup.reduce((sum, p) => sum + p.assistsPerGame, 0);
    const totalSPG = lineup.reduce((sum, p) => sum + p.stealsPerGame, 0);
    const totalBPG = lineup.reduce((sum, p) => sum + p.blocksPerGame, 0);
    
    // Averages
    const avgPER = lineup.reduce((sum, p) => sum + p.playerEfficiencyRating, 0) / lineup.length;
    const avgFG = lineup.reduce((sum, p) => sum + p.fieldGoalPercentage, 0) / lineup.length;
    const avg3P = lineup.reduce((sum, p) => sum + p.threePointPercentage, 0) / lineup.length;
    const avgFT = lineup.reduce((sum, p) => sum + p.freeThrowPercentage, 0) / lineup.length;
    
    // Experience and achievements
    const totalChampionships = lineup.reduce((sum, p) => sum + p.championships, 0);
    const totalMVPs = lineup.reduce((sum, p) => sum + p.mvpAwards, 0);
    const totalAllStars = lineup.reduce((sum, p) => sum + p.allStarSelections, 0);
    const avgYearsExperience = lineup.reduce((sum, p) => sum + p.yearsInLeague, 0) / lineup.length;

    // Team balance score (0-100)
    // Check if positions are balanced
    const hasPG = lineup.some(p => p.position.includes("Point Guard") || p.position.includes("Guard"));
    const hasSG = lineup.some(p => p.position.includes("Shooting Guard") || p.position.includes("Guard"));
    const hasSF = lineup.some(p => p.position.includes("Small Forward") || p.position.includes("Forward"));
    const hasPF = lineup.some(p => p.position.includes("Power Forward") || p.position.includes("Forward"));
    const hasC = lineup.some(p => p.position.includes("Center"));
    
    const positionBalance = (hasPG ? 20 : 0) + (hasSG ? 20 : 0) + (hasSF ? 20 : 0) + (hasPF ? 20 : 0) + (hasC ? 20 : 0);
    
    // Defense score (steals + blocks)
    const defenseScore = ((totalSPG + totalBPG) / 5) * 20; // Normalize to 0-100 scale
    
    // Offense score (scoring + shooting)
    const offenseScore = ((totalPPG / 150) * 50) + ((avgFG + avg3P) / 2); // Normalize
    
    // Calculate realistic team PPG (accounting for ball sharing and team play)
    // In NBA, teams typically score 100-120 PPG, individual stats don't directly sum
    // Account for ball sharing: more players = less individual scoring but better team play
    const ballSharingFactor = lineup.length === 5 ? 0.75 : lineup.length === 4 ? 0.80 : lineup.length === 3 ? 0.85 : 0.90;
    const teamSynergyBonus = lineup.length === 5 ? 15 : lineup.length === 4 ? 10 : lineup.length === 3 ? 5 : 0;
    const expectedPoints = Math.min(130, (totalPPG * ballSharingFactor) + teamSynergyBonus);
    
    // Expected rebounds (less affected by team play)
    const expectedRebounds = totalRPG * 0.95; // Slight reduction due to team play
    
    // Expected assists (increases with team play)
    const expectedAssists = totalAPG * 1.15; // Assists increase with better team play
    
    // Calculate win probability using multiple factors
    // Base win rate from PER (NBA average PER is ~15, elite is 25+)
    const perScore = Math.min(100, (avgPER / 30) * 100); // Scale PER to 0-100
    
    // Offense contribution (40% weight)
    const offenseContribution = (offenseScore / 100) * 40;
    
    // Defense contribution (25% weight)
    const defenseContribution = Math.min(25, (defenseScore / 100) * 25);
    
    // Experience contribution (15% weight)
    const experienceContribution = Math.min(15, (avgYearsExperience / 15) * 15);
    
    // Achievement bonus (10% weight)
    const achievementBonus = Math.min(10, (totalChampionships * 1.5) + (totalMVPs * 1) + (totalAllStars * 0.2));
    
    // Position balance bonus (10% weight)
    const balanceBonus = (positionBalance / 100) * 10;
    
    // Full lineup bonus
    const fullLineupBonus = lineup.length === 5 ? 5 : 0;
    
    // Calculate final win probability
    const winProbability = Math.min(92, Math.max(8, 
      perScore * 0.3 + 
      offenseContribution + 
      defenseContribution + 
      experienceContribution + 
      achievementBonus + 
      balanceBonus + 
      fullLineupBonus
    ));
    
    const lossProbability = 100 - winProbability;

    // Calculate point score probability (chance of scoring 100+ points in a game)
    // NBA teams typically score 100-120 PPG, so 100+ is common for good teams
    const baseScoreProbability = (expectedPoints / 110) * 100;
    const pointScoreProbability = Math.min(98, Math.max(2, baseScoreProbability));

    // Calculate team efficiency
    const teamEfficiency = (avgPER + (avgFG + avg3P) / 2) / 2;

    return {
      totalPPG,
      totalRPG,
      totalAPG,
      totalSPG,
      totalBPG,
      avgPER,
      winProbability,
      lossProbability,
      expectedPoints,
      expectedRebounds,
      expectedAssists,
      pointScoreProbability,
      avgFG,
      avg3P,
      avgFT,
      teamEfficiency,
      offenseScore: offenseScore.toFixed(1),
      defenseScore: defenseScore.toFixed(1),
      positionBalance,
      lineup,
      totalChampionships,
      totalMVPs,
      totalAllStars,
      avgYearsExperience: avgYearsExperience.toFixed(1),
    };
  }, [formation]);

  const winLossData = {
    labels: ["Win Probability", "Loss Probability"],
    datasets: [
      {
        data: teamStats
          ? [teamStats.winProbability, teamStats.lossProbability]
          : [50, 50],
        backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(239, 68, 68, 0.7)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const performanceData = {
    labels: ["Expected PPG", "Expected RPG", "Expected APG"],
    datasets: [
      {
        label: "Team Performance",
        data: teamStats
          ? [
              teamStats.expectedPoints,
              teamStats.expectedRebounds,
              teamStats.expectedAssists,
            ]
          : [0, 0, 0],
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

  const positions = [
    { key: "PG", label: "Point Guard", x: "50%", y: "85%", color: "bg-blue-500" },
    { key: "SG", label: "Shooting Guard", x: "20%", y: "70%", color: "bg-green-500" },
    { key: "SF", label: "Small Forward", x: "80%", y: "70%", color: "bg-yellow-500" },
    { key: "PF", label: "Power Forward", x: "30%", y: "30%", color: "bg-orange-500" },
    { key: "C", label: "Center", x: "70%", y: "30%", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">🏀 Formation Builder</h2>
            <p className="text-indigo-100">Drag players to court positions and see team predictions</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Court Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Court Formation</h3>
          <div
            className="relative bg-gradient-to-b from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 rounded-lg border-4 border-orange-300 dark:border-orange-700"
            style={{ height: "600px", minHeight: "600px" }}
            onDragOver={handleDragOver}
          >
            {/* Court Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Center Line */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="#1a1a1a" strokeWidth="0.5" />
              {/* Free Throw Line */}
              <line x1="20" y1="30" x2="80" y2="30" stroke="#1a1a1a" strokeWidth="0.5" />
              {/* Three Point Arc */}
              <path
                d="M 10 30 Q 50 5 90 30"
                fill="none"
                stroke="#ffd700"
                strokeWidth="0.5"
              />
              {/* Hoop */}
              <circle cx="50" cy="10" r="2" fill="#ff6b35" />
            </svg>

            {/* Position Slots */}
            {positions.map((pos) => (
              <div
                key={pos.key}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  formation[pos.key] ? "cursor-pointer" : "cursor-pointer"
                }`}
                style={{ left: pos.x, top: pos.y }}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(pos.key)}
              >
                <div
                  className={`w-24 h-24 rounded-full border-4 border-dashed ${
                    formation[pos.key]
                      ? "bg-green-200 dark:bg-green-800 border-green-500 dark:border-green-400"
                      : "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                  } flex flex-col items-center justify-center p-2 transition-all hover:scale-110`}
                >
                  {formation[pos.key] ? (
                    <>
                      <div className="text-xs font-bold text-gray-800 dark:text-white text-center truncate w-full">
                        {formation[pos.key].name.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {formation[pos.key].pointsPerGame.toFixed(1)} PPG
                      </div>
                      <button
                        onClick={() => removePlayer(pos.key)}
                        className="mt-1 text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {pos.label}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Pool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Player Pool</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {players.map((player) => {
              const isInFormation = Object.values(formation).some(
                (p) => p && p.id === player.id
              );
              return (
                <motion.div
                  key={player.id}
                  draggable={!isInFormation}
                  onDragStart={() => !isInFormation && handleDragStart(player)}
                  whileDrag={{ opacity: 0.5, scale: 0.9 }}
                  className={`p-3 rounded-lg border-2 ${
                    isInFormation
                      ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 cursor-move hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">
                        {player.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {player.team} • {player.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {player.pointsPerGame.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">PPG</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      {teamStats && teamStats.lineup.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Win/Loss Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Win/Loss Probability
              </h3>
              <div className="h-64">
                <Doughnut data={winLossData} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Win Rate</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {teamStats.winProbability.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loss Rate</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {teamStats.lossProbability.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Expected Performance
              </h3>
              <div className="h-64">
                <Bar data={performanceData} />
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Team Statistics</h3>
            
            {/* Primary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-red-300 dark:border-red-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected PPG</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {teamStats.expectedPoints.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  (Individual: {teamStats.totalPPG.toFixed(1)})
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected RPG</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {teamStats.expectedRebounds.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  (Individual: {teamStats.totalRPG.toFixed(1)})
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-green-300 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected APG</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {teamStats.expectedAssists.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  (Individual: {teamStats.totalAPG.toFixed(1)})
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-purple-300 dark:border-purple-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">100+ Points Prob.</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {teamStats.pointScoreProbability.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Per Game
                </p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average PER</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {teamStats.avgPER.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {teamStats.avgPER > 25 ? "Elite" : teamStats.avgPER > 20 ? "All-Star" : "Good"}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg FG%</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {teamStats.avgFG.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Field Goals
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg 3P%</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {teamStats.avg3P.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Three Point
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Team Efficiency</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {teamStats.teamEfficiency.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Combined Rating
                </p>
              </div>
            </div>

            {/* Team Analysis */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Offense Score</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {teamStats.offenseScore}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${teamStats.offenseScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Defense Score</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {teamStats.defenseScore}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${teamStats.defenseScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Position Balance</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {teamStats.positionBalance}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${teamStats.positionBalance}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {teamStats.avgYearsExperience} yrs
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Avg Years
                </p>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center border-2 border-yellow-300 dark:border-yellow-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">🏆 Championships</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {teamStats.totalChampionships}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center border-2 border-purple-300 dark:border-purple-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">⭐ MVP Awards</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {teamStats.totalMVPs}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">🌟 All-Star Selections</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {teamStats.totalAllStars}
                </p>
              </div>
            </div>
          </div>

          {/* Lineup Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Current Lineup</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {positions.map((pos) => (
                <div
                  key={pos.key}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                >
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {pos.label}
                  </p>
                  {formation[pos.key] ? (
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">
                        {formation[pos.key].name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formation[pos.key].team}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {formation[pos.key].pointsPerGame.toFixed(1)} PPG
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Empty</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {(!teamStats || teamStats.lineup.length === 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Drag players to court positions to see predictions
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Fill all 5 positions for best predictions
          </p>
        </div>
      )}
    </div>
  );
}

