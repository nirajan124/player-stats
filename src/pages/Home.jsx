import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import playersData from "../data/players.json";
import PlayerCard from "../components/PlayerCard";
import PlayerChart from "../components/PlayerChart";
import AIFeatures from "../components/AIFeatures";
import PlayerComparison from "../components/PlayerComparison";
import BasketballCourt3D from "../components/BasketballCourt3D";
import ShotChart from "../components/ShotChart";
import CareerTimeline from "../components/CareerTimeline";
import AdvancedStats from "../components/AdvancedStats";
import PlayerRankings from "../components/PlayerRankings";
import TeamStatistics from "../components/TeamStatistics";
import PlayerEvaluation from "../components/PlayerEvaluation";
import PlayerFuturePrediction from "../components/PlayerFuturePrediction";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [comparePlayer1, setComparePlayer1] = useState(null);
  const [comparePlayer2, setComparePlayer2] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("pointsPerGame");
  const [showAI, setShowAI] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [activeFeature, setActiveFeature] = useState("home"); // home, comparison, evaluation, rankings, teams, export, formation
  const [rankingCategory, setRankingCategory] = useState("points");
  const [showFormation, setShowFormation] = useState(false);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Get unique teams and positions for filters
  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(playersData.map((p) => p.team))];
    return uniqueTeams.sort();
  }, []);

  const positions = useMemo(() => {
    const uniquePositions = [...new Set(playersData.map((p) => p.position))];
    return uniquePositions.sort();
  }, []);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let filtered = playersData.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = teamFilter === "All" || player.team === teamFilter;
      const matchesPosition =
        positionFilter === "All" || player.position === positionFilter;

      return matchesSearch && matchesTeam && matchesPosition;
    });

    // Sort players
    filtered.sort((a, b) => {
      if (sortBy === "pointsPerGame") return b.pointsPerGame - a.pointsPerGame;
      if (sortBy === "playerEfficiencyRating") return b.playerEfficiencyRating - a.playerEfficiencyRating;
      if (sortBy === "reboundsPerGame") return b.reboundsPerGame - a.reboundsPerGame;
      if (sortBy === "assistsPerGame") return b.assistsPerGame - a.assistsPerGame;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  }, [searchTerm, teamFilter, positionFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTeamFilter("All");
    setPositionFilter("All");
    setSortBy("pointsPerGame");
    setSelected(null);
    setComparePlayer1(null);
    setComparePlayer2(null);
  };

  const topPerformers = useMemo(() => {
    return playersData
      .sort((a, b) => b.playerEfficiencyRating - a.playerEfficiencyRating)
      .slice(0, 5);
  }, []);

  const tabs = [
    { id: "overview", label: "📊 Overview", icon: "📊" },
    { id: "3dcourt", label: "🏀 3D Court", icon: "🏀" },
    { id: "shotchart", label: "🎯 Shot Chart", icon: "🎯" },
    { id: "timeline", label: "📅 Timeline", icon: "📅" },
    { id: "advanced", label: "📈 Advanced", icon: "📈" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-red-50 to-orange-100"
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block px-8 py-4 rounded-2xl shadow-2xl mb-4 ${
              darkMode 
                ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white" 
                : "bg-gradient-to-r from-orange-600 to-red-600 text-white"
            }`}
          >
            <h1 className="text-5xl font-bold mb-2">🏀 NBA Player Analytics</h1>
            <p className={`text-lg ${darkMode ? "text-gray-200" : "text-orange-100"}`}>
              AI-Powered Basketball Statistics & Performance Analysis
            </p>
          </motion.div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 sticky top-4 z-50"
        >
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <button
              onClick={() => setActiveFeature("home")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "home"
                  ? "bg-orange-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setActiveFeature("comparison")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "comparison"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              ⚔️ Comparison
            </button>
            <button
              onClick={() => setActiveFeature("evaluation")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "evaluation"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📊 Evaluation
            </button>
            <button
              onClick={() => setActiveFeature("rankings")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "rankings"
                  ? "bg-yellow-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🏆 Rankings
            </button>
            <button
              onClick={() => setActiveFeature("teams")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "teams"
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🏀 Team Stats
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(playersData, null, 2);
                const dataBlob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "nba-players-data.json";
                link.click();
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              💾 Export Data
            </button>
            <button
              onClick={() => {
                const csv = [
                  ["Name", "Team", "Position", "PPG", "RPG", "APG", "PER"].join(","),
                  ...playersData.map(p => [
                    p.name,
                    p.team,
                    p.position,
                    p.pointsPerGame,
                    p.reboundsPerGame,
                    p.assistsPerGame,
                    p.playerEfficiencyRating
                  ].join(","))
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "nba-players.csv";
                link.click();
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all"
            >
              📄 Export CSV
            </button>
            <button
              onClick={() => {
                setActiveFeature("prediction");
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === "prediction"
                  ? "bg-pink-600 text-white shadow-lg scale-105"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              🔮 Predictions
            </button>
          </div>
        </motion.div>

        {/* Feature Content Based on Active Feature */}
        <AnimatePresence mode="wait">
          {activeFeature === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Comparison Mode Toggle */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">⚔️ Quick Comparison</h3>
                  <div className="flex gap-3 flex-wrap">
                    <select
                      value={comparePlayer1?.id || ""}
                      onChange={(e) => {
                        const player = playersData.find(p => p.id === parseInt(e.target.value));
                        setComparePlayer1(player || null);
                        if (player) setActiveFeature("comparison");
                      }}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Player 1</option>
                      {playersData.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <select
                      value={comparePlayer2?.id || ""}
                      onChange={(e) => {
                        const player = playersData.find(p => p.id === parseInt(e.target.value));
                        setComparePlayer2(player || null);
                        if (player) setActiveFeature("comparison");
                      }}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Player 2</option>
                      {playersData.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {(comparePlayer1 || comparePlayer2) && (
                      <button
                        onClick={() => {
                          setComparePlayer1(null);
                          setComparePlayer2(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Player Comparison */}
              {comparePlayer1 && comparePlayer2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8"
                >
                  <PlayerComparison player1={comparePlayer1} player2={comparePlayer2} />
                </motion.div>
              )}
            </motion.div>
          )}

          {activeFeature === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">⚔️ Player Comparison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Player 1
                    </label>
                    <select
                      value={comparePlayer1?.id || ""}
                      onChange={(e) => {
                        const player = playersData.find(p => p.id === parseInt(e.target.value));
                        setComparePlayer1(player || null);
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Player 1</option>
                      {playersData.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Player 2
                    </label>
                    <select
                      value={comparePlayer2?.id || ""}
                      onChange={(e) => {
                        const player = playersData.find(p => p.id === parseInt(e.target.value));
                        setComparePlayer2(player || null);
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Player 2</option>
                      {playersData.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {comparePlayer1 && comparePlayer2 ? (
                <PlayerComparison player1={comparePlayer1} player2={comparePlayer2} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <p className="text-xl text-gray-600 dark:text-gray-400">Select two players to compare</p>
                </div>
              )}
            </motion.div>
          )}

          {activeFeature === "evaluation" && (
            <motion.div
              key="evaluation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              {selected ? (
                <PlayerEvaluation player={selected} allPlayers={playersData} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">📊 Player Evaluation</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a player from the list below to see their comprehensive evaluation
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playersData.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => setSelected(player)}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-left transition-all"
                      >
                        <p className="font-bold text-gray-800 dark:text-white">{player.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{player.team}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selected && (
                <PlayerEvaluation player={selected} allPlayers={playersData} />
              )}
            </motion.div>
          )}

          {activeFeature === "rankings" && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🏆 Player Rankings</h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setRankingCategory("points")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      rankingCategory === "points"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Points
                  </button>
                  <button
                    onClick={() => setRankingCategory("rebounds")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      rankingCategory === "rebounds"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Rebounds
                  </button>
                  <button
                    onClick={() => setRankingCategory("assists")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      rankingCategory === "assists"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Assists
                  </button>
                  <button
                    onClick={() => setRankingCategory("per")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      rankingCategory === "per"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    PER
                  </button>
                </div>
              </div>
              <PlayerRankings players={playersData} category={rankingCategory} />
            </motion.div>
          )}

          {activeFeature === "teams" && (
            <motion.div
              key="teams"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <TeamStatistics players={playersData} />
            </motion.div>
          )}

          {activeFeature === "prediction" && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <PlayerFuturePrediction
                players={playersData}
                onClose={() => {
                  setActiveFeature("home");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Only show player list and cards when on home */}
        {activeFeature === "home" && (
          <>

        {/* Top Performers Quick View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">⭐ Top Performers (PER)</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topPerformers.map((player, idx) => (
              <motion.div
                key={player.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border-2 border-orange-200 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelected(player)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">#{idx + 1}</span>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    PER: {player.playerEfficiencyRating.toFixed(1)}
                  </span>
                </div>
                <p className="font-bold text-gray-800 dark:text-white">{player.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{player.team}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{player.pointsPerGame} PPG</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Players
              </label>
              <input
                type="text"
                placeholder="Name or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏀 Filter by Team
              </label>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="All">All Teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📍 Filter by Position
              </label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="All">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="pointsPerGame">Points Per Game</option>
                <option value="playerEfficiencyRating">Player Efficiency</option>
                <option value="reboundsPerGame">Rebounds Per Game</option>
                <option value="assistsPerGame">Assists Per Game</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            {(searchTerm || teamFilter !== "All" || positionFilter !== "All") && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            )}
            <div className="ml-auto flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                {viewMode === "cards" ? "📋 List View" : "🃏 Card View"}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-semibold">
            Showing <span className="text-orange-600 dark:text-orange-400">{filteredPlayers.length}</span> of{" "}
            <span className="text-orange-600 dark:text-orange-400">{playersData.length}</span> players
          </div>
        </div>

        {/* Player Cards Grid */}
        {filteredPlayers.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-6 mb-8 ${
              viewMode === "cards"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            <AnimatePresence>
              {filteredPlayers.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <PlayerCard
                    player={player}
                    onSelect={setSelected}
                    isSelected={selected?.id === player.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 dark:text-gray-400 mb-2">No players found</p>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Selected Player Details */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                {selected.name} - Detailed Analysis
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setShowAI(!showAI)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    showAI
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
                  }`}
                >
                  {showAI ? "📊 Hide AI" : "🤖 Show AI"}
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    setShowAI(false);
                    setActiveTab("overview");
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* AI Features */}
                  {showAI && (
                    <div className="animate-fade-in mb-6">
                      <AIFeatures player={selected} allPlayers={playersData} />
                    </div>
                  )}

                  {/* Charts */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <PlayerChart player={selected} careerHistory={selected.careerHistory} />
                  </div>

                  {/* Career Achievements */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-6 rounded-xl shadow-lg border-2 border-yellow-200 dark:border-yellow-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🏆 Career Achievements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Championships</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{selected.championships}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">MVP Awards</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{selected.mvpAwards}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">All-Star Selections</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selected.allStarSelections}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Years in League</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{selected.yearsInLeague}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notable Achievements:</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 border border-yellow-300 dark:border-yellow-700"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "3dcourt" && (
                <motion.div
                  key="3dcourt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BasketballCourt3D player={selected} />
                </motion.div>
              )}

              {activeTab === "shotchart" && (
                <motion.div
                  key="shotchart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShotChart player={selected} />
                </motion.div>
              )}

              {activeTab === "timeline" && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CareerTimeline player={selected} />
                </motion.div>
              )}

              {activeTab === "advanced" && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AdvancedStats player={selected} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
