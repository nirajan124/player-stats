export default function PlayerCard({ player, onSelect, isSelected = false }) {
  const efficiencyColor = player.playerEfficiencyRating >= 30 
    ? "text-green-600" 
    : player.playerEfficiencyRating >= 25 
    ? "text-blue-600" 
    : "text-gray-600";

  return (
    <div 
      className={`p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-xl rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
        isSelected 
          ? "border-blue-500 ring-4 ring-blue-200 dark:ring-blue-800" 
          : "border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
      }`}
      onClick={() => onSelect(player)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{player.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{player.position}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${efficiencyColor} dark:text-green-400`}>
            {player.playerEfficiencyRating.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">PER</div>
        </div>
      </div>

      {/* Team Info */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{player.team}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{player.height} • {player.weight} lbs • Age {player.age}</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">PPG</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{player.pointsPerGame}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">RPG</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{player.reboundsPerGame}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">APG</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{player.assistsPerGame}</p>
        </div>
      </div>

      {/* Achievements Badge */}
      <div className="flex flex-wrap gap-2 mt-4">
        {player.championships > 0 && (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded">
            🏆 {player.championships}x Champ
          </span>
        )}
        {player.mvpAwards > 0 && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded">
            ⭐ {player.mvpAwards}x MVP
          </span>
        )}
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded">
          {player.allStarSelections}x All-Star
        </span>
      </div>

      {/* Shooting Percentages */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-300">FG%: <span className="font-semibold">{player.fieldGoalPercentage}%</span></span>
          <span className="text-gray-600 dark:text-gray-300">3P%: <span className="font-semibold">{player.threePointPercentage}%</span></span>
          <span className="text-gray-600 dark:text-gray-300">FT%: <span className="font-semibold">{player.freeThrowPercentage}%</span></span>
        </div>
      </div>
    </div>
  );
}
