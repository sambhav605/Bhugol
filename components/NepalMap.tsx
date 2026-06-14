"use client"

// import { DISTRICTS, MAP_WIDTH, MAP_HEIGHT } from "@/data/Districtsdata"
import { DISTRICTS,MAP_HEIGHT,MAP_WIDTH } from "@/data/districtsData "
import type { DistrictState } from "@/types"

interface NepalMapProps {
  districts: DistrictState
  width?: number
  height?: number
}

const COLOR_IDLE = "#D3D1C7"
const COLOR_CORRECT = "#639922"
const COLOR_REVEALED = "#D85A30"
const COLOR_STROKE = "#FFFFFF"

function statusColor(status: string): string {
  if (status === "correct") return COLOR_CORRECT
  if (status === "revealed") return COLOR_REVEALED
  return COLOR_IDLE
}

export function NepalMap({ districts }: NepalMapProps) {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="img"
      aria-label="Map of the 77 districts of Nepal"
      className="h-auto w-full"
    >
      {DISTRICTS.map((district) => {
        const status = districts[district.name] ?? "idle"
        return (
          <g key={district.name} className={`district district-${district.name.replace(/\s+/g, "-")}`}>
            <path
              d={district.d}
              fill={statusColor(status)}
              stroke={COLOR_STROKE}
              strokeWidth={0.6}
              strokeLinejoin="round"
              style={{ transition: "fill 200ms ease" }}
            />
            <text
              x={district.cx}
              y={district.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontSize={7}
              fontWeight={600}
              pointerEvents="none"
              style={{
                paintOrder: "stroke",
                stroke: "rgba(0,0,0,0.35)",
                strokeWidth: "1.4px",
                opacity: status === "idle" ? 0 : 1,
                transition: "opacity 200ms ease",
              }}
            >
              {district.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}