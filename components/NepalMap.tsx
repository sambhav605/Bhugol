"use client"

import { useEffect, useMemo, useRef } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { select } from "d3-selection"
import "d3-transition" // registers selection.transition()
import type { DistrictCollection, DistrictState } from "@/types"

interface NepalMapProps {
  geoData: DistrictCollection
  districts: DistrictState
  width?: number
  height?: number
}

const COLOR_IDLE = "#D3D1C7"
const COLOR_CORRECT = "#639922"
const COLOR_REVEALED = "#D85A30"
const COLOR_STROKE = "#FFFFFF"

function NepalMapComponent({
  geoData,
  districts,
  width = 900,
  height = 480,
}: NepalMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const isInitializedRef = useRef(false)

  // Projection + path generator only depend on the geometry and size.
  const { pathFor, centroidFor } = useMemo(() => {
    const projection = geoMercator().fitSize(
      [width, height],
      geoData as unknown as GeoJSON.FeatureCollection,
    )
    const path = geoPath(projection)
    return {
      pathFor: (feature: GeoJSON.Feature) => path(feature) ?? "",
      centroidFor: (feature: GeoJSON.Feature) => path.centroid(feature),
    }
  }, [geoData, width, height])

  // Initial render: draw all district paths + (hidden) labels once.
  useEffect(() => {
    if (isInitializedRef.current) return

    console.log("Initializing map with", geoData.features.length, "features")
    console.log("First feature properties:", geoData.features[0].properties)

    const svg = select(svgRef.current)
    if (!svg.node()) {
      console.error("SVG node not found")
      return
    }

    svg.selectAll("*").remove()

    const groups = svg
      .selectAll("g.district")
      .data(geoData.features)
      .enter()
      .append("g")
      .attr("class", "district")

    groups
      .append("path")
      .attr("d", (d) => pathFor(d as unknown as GeoJSON.Feature))
      .attr("fill", COLOR_IDLE)
      .attr("stroke", COLOR_STROKE)
      .attr("stroke-width", 0.6)
      .attr("stroke-linejoin", "round")

    groups
      .append("text")
      .attr("x", (d) => centroidFor(d as unknown as GeoJSON.Feature)[0])
      .attr("y", (d) => centroidFor(d as unknown as GeoJSON.Feature)[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#FFFFFF")
      .attr("font-size", 7)
      .attr("font-weight", 600)
      .attr("pointer-events", "none")
      .style("paint-order", "stroke")
      .style("stroke", "rgba(0,0,0,0.35)")
      .style("stroke-width", "1.4px")
      .style("opacity", 0)
      .text((d) => (d as { properties: { name: string } }).properties.name)

    console.log("Map initialized with", svg.selectAll("g.district").size(), "groups")
    isInitializedRef.current = true
  }, [geoData, pathFor, centroidFor])

  // Re-color + toggle labels whenever the district statuses change.
  useEffect(() => {
    if (!isInitializedRef.current) return

    const svg = select(svgRef.current)

    svg
      .selectAll<SVGGElement, GeoJSON.Feature>("g.district")
      .each(function (d) {
        const name = (d as unknown as { properties: { name: string } }).properties.name
        const status = districts[name] ?? "idle"
        const fill =
          status === "correct"
            ? COLOR_CORRECT
            : status === "revealed"
              ? COLOR_REVEALED
              : COLOR_IDLE

        const group = select(this)
        group
          .select("path")
          .transition()
          .duration(200)
          .attr("fill", fill)

        group
          .select("text")
          .transition()
          .duration(200)
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
