declare module "*.geojson" {
  const value: {
    type: "FeatureCollection"
    features: Array<{
      type: "Feature"
      properties: { name: string } & Record<string, unknown>
      geometry: {
        type: "Polygon" | "MultiPolygon"
        coordinates: number[][][] | number[][][][]
      }
    }>
  }
  export default value
}
