import { ALIASES } from "./aliases"

/**
 * Normalize a string for matching:
 * - lowercase
 * - strip accents / diacritics
 * - remove anything that is not a letter or digit
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .replace(/[^a-z0-9]/g, "")
}

/**
 * Build a lookup from a normalized accepted-input -> canonical district name.
 * Includes the canonical names themselves plus every alias.
 */
function buildLookup(allNames: string[]): Map<string, string> {
  const lookup = new Map<string, string>()

  for (const canonical of allNames) {
    lookup.set(normalize(canonical), canonical)
  }

  // Aliases are keyed by canonical-lowercase, so map them to the real
  // canonical name (preserving original casing) when possible.
  const canonicalByLower = new Map<string, string>()
  for (const canonical of allNames) {
    canonicalByLower.set(canonical.toLowerCase(), canonical)
  }

  for (const [canonicalLower, accepted] of Object.entries(ALIASES)) {
    const canonical = canonicalByLower.get(canonicalLower)
    if (!canonical) continue
    for (const alt of accepted) {
      lookup.set(normalize(alt), canonical)
    }
  }

  return lookup
}


export function findMatch(input: string, allNames: string[]): string | null {
  const normalized = normalize(input)
  if (!normalized) return null

  const lookup = buildLookup(allNames)

  // Exact match (canonical or alias)
  const exact = lookup.get(normalized)
  if (exact) return exact

  return null
}
