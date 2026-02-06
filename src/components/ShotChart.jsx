import { useMemo } from "react";

export default function ShotChart({ player }) {
  if (!player) return null;

  // Generate shot data based on player stats
  const shotData = useMemo(() => {
    const fgPct = player.fieldGoalPercentage / 100;
    const threePct = player.threePointPercentage / 100;
    const ppg = player.pointsPerGame;

    // Court zones with shot attempts and makes
    return [
      { zone: "Paint", attempts: Math.round(ppg * 0.3), makes: Math.round(ppg * 0.3 * fgPct), x: 50, y: 15 },
      { zone: "Mid-Range Left", attempts: Math.round(ppg * 0.2), makes: Math.round(ppg * 0.2 * fgPct), x: 25, y: 30 },
      { zone: "Mid-Range Right", attempts: Math.round(ppg * 0.2), makes: Math.round(ppg * 0.2 * fgPct), x: 75, y: 30 },
      { zone: "3PT Left Corner", attempts: Math.round(ppg * 0.15), makes: Math.round(ppg * 0.15 * threePct), x: 10, y: 5 },
      { zone: "3PT Right Corner", attempts: Math.round(ppg * 0.15), makes: Math.round(ppg * 0.15 * threePct), x: 90, y: 5 },
      { zone: "3PT Top", attempts: Math.round(ppg * 0.2), makes: Math.round(ppg * 0.2 * threePct), x: 50, y: 5 },
    ];
  }, [player]);

  const maxAttempts = Math.max(...shotData.map(d => d.attempts));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">🎯 Shot Chart - {player.name}</h3>
      <div className="relative bg-gradient-to-b from-orange-100 to-orange-50 rounded-lg p-8" style={{ height: "500px" }}>
        {/* Court Visualization */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          {/* Court Outline */}
          <rect x="10" y="5" width="80" height="90" fill="#ff6b35" stroke="#1a1a1a" strokeWidth="0.5" />
          
          {/* Center Line */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeWidth="0.3" />
          
          {/* Free Throw Line */}
          <line x1="20" y1="30" x2="80" y2="30" stroke="#ffffff" strokeWidth="0.3" />
          
          {/* Three Point Arc */}
          <path
            d="M 10 30 Q 50 5 90 30"
            fill="none"
            stroke="#ffd700"
            strokeWidth="0.5"
          />
          
          {/* Hoop */}
          <circle cx="50" cy="10" r="2" fill="#ff6b35" />
          
          {/* Shot Zones */}
          {shotData.map((zone, idx) => {
            const size = (zone.attempts / maxAttempts) * 8;
            const color = zone.makes / zone.attempts > 0.5 ? "#00ff00" : zone.makes / zone.attempts > 0.3 ? "#ffff00" : "#ff0000";
            
            return (
              <g key={idx}>
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={size}
                  fill={color}
                  opacity={0.6}
                  stroke="#000"
                  strokeWidth="0.2"
                />
                <text
                  x={zone.x}
                  y={zone.y}
                  textAnchor="middle"
                  fontSize="2"
                  fill="#000"
                  fontWeight="bold"
                >
                  {zone.makes}/{zone.attempts}
                </text>
                <text
                  x={zone.x}
                  y={zone.y + 3}
                  textAnchor="middle"
                  fontSize="1.5"
                  fill="#333"
                >
                  {zone.zone}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {shotData.map((zone, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-sm text-gray-800">{zone.zone}</p>
            <p className="text-xs text-gray-600">
              {zone.makes}/{zone.attempts} ({((zone.makes / zone.attempts) * 100).toFixed(0)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

