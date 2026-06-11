export type DistrictStatus = "idle" | "correct" | "revealed"

export interface District {
  /** Canonical district name from the GeoJSON */
  name: string
  geometry: GeoJSON.Geometry
}

export interface DistrictFeature {
  type: "Feature"
  properties: { name: string }
  geometry: GeoJSON.Geometry
}

export interface DistrictCollection {
  type: "FeatureCollection"
  features: DistrictFeature[]
}

/** Map of canonical district name -> its current status */
export type DistrictState = Record<string, DistrictStatus>

export interface GameState {
  districts: DistrictState
  correctCount: number
  isOver: boolean
}
