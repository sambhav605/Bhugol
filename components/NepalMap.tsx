"use client"

import { useEffect, useMemo, useRef } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { select } from "d3-selection"
import "d3-transition"
import type { DistrictCollection, DistrictState } from "@/types"

// ─── Types ────────────────────────────────────────────────────────────────────

type DistrictProperties = { name: string }
type DistrictFeature = GeoJSON.Feature<GeoJSON.Geometry, DistrictProperties>
type DistrictFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  DistrictProperties
>

interface NepalMapProps {
  geoData: DistrictCollection
  districts: DistrictState
  width?: number
  height?: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_IDLE = "#D3D1C7"
const COLOR_CORRECT = "#639922"
const COLOR_REVEALED = "#D85A30"
const COLOR_STROKE = "#FFFFFF"

const TRANSITION_MS = 200

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string): string {
  if (status === "correct") return COLOR_CORRECT
  if (status === "revealed") return COLOR_REVEALED
  return COLOR_IDLE
}

// ─── Component ────────────────────────────────────────────────────────────────

function NepalMapComponent({
  geoData,
  districts,
  width = 900,
  height = 480,
}: NepalMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Recompute projection only when geometry or canvas size changes.
  const { pathFor, centroidFor } = useMemo(() => {
    const projection = geoMercator().fitSize(
      [width, height],
      geoData as unknown as DistrictFeatureCollection,
    )
    const path = geoPath(projection)
    return {
      pathFor: (f: DistrictFeature) => path(f) ?? "",
      centroidFor: (f: DistrictFeature) => path.centroid(f),
    }
  }, [geoData, width, height])

  // ── Initial render ──────────────────────────────────────────────────────────
  // Runs whenever geometry or projection changes. Wipes the SVG and redraws
  // every district path + label from scratch, seeding colors from `districts`
  // so the first paint is already correct even if statuses are non-idle.
  useEffect(() => {
    const svg = select(svgRef.current)
    if (!svg.node()) return

    svg.selectAll("*").remove()

    const features = geoData.features as unknown as DistrictFeature[]

    const groups = svg
      .selectAll<SVGGElement, DistrictFeature>("g.district")
      .data(features, (d) => d.properties.name) // key by name for stable joins
      .enter()
      .append("g")
      .attr("class", (d) => `district district-${d.properties.name.replace(/\s+/g, "-")}`)

    // Path
    groups
      .append("path")
      .attr("d", pathFor)
      .attr("fill", (d) => statusColor(districts[d.properties.name] ?? "idle"))
      .attr("stroke", COLOR_STROKE)
      .attr("stroke-width", 0.6)
      .attr("stroke-linejoin", "round")

    // Label (hidden until district is answered)
    groups
      .append("text")
      .attr("x", (d) => centroidFor(d)[0])
      .attr("y", (d) => centroidFor(d)[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#FFFFFF")
      .attr("font-size", 7)
      .attr("font-weight", 600)
      .attr("pointer-events", "none")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(0,0,0,0.35)")
      .style("stroke-width", "1.4px")
      .style("opacity", (d) =>
        (districts[d.properties.name] ?? "idle") === "idle" ? 0 : 1,
      )
      .text((d) => d.properties.name)
  }, [geoData, pathFor, centroidFor]) // intentionally omits `districts` — see below

  // ── Status updates ──────────────────────────────────────────────────────────
  // Runs only when district statuses change. Skips full redraws; surgically
  // transitions each group's fill and label opacity.
  useEffect(() => {
    const svg = select(svgRef.current)
    if (!svg.node()) return

    // If the SVG hasn't been initialized yet (no groups present), bail out.
    // This handles the rare case where this effect fires before the init effect.
    if (svg.selectAll("g.district").size() === 0) return

    svg
      .selectAll<SVGGElement, DistrictFeature>("g.district")
      .each(function (d) {
        const status = districts[d.properties.name] ?? "idle"
        const group = select(this)

        group
          .select("path")
          .transition()
          .duration(TRANSITION_MS)
          .attr("fill", statusColor(status))

        group
          .select("text")
          .transition()
          .duration(TRANSITION_MS)
          .style("opacity", status === "idle" ? 0 : 1)
      })
  }, [districts])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Map of the 77 districts of Nepal"
      className="h-auto w-full"
    />
  )
}

export const NepalMap = NepalMapComponent
