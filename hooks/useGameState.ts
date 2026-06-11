"use client"

import { useCallback, useMemo, useState } from "react"
import type { DistrictState } from "@/types"
import { findMatch } from "@/lib/matcher"

interface UseGameStateResult {
  districts: DistrictState
  correctCount: number
  total: number
  isOver: boolean
  /** Names of districts the player never got right (only meaningful once over). */
  missed: string[]
  /**
   * Attempt a guess. Returns the canonical district name if it was a new,
   * correct match (so the caller can clear the input / flash feedback),
   * otherwise null.
   */
  guess: (input: string) => string | null
  /** Reveal every remaining district and end the game. */
  giveUp: () => void
  /** Reset all state back to the start. */
  reset: () => void
}

export function useGameState(allNames: string[]): UseGameStateResult {
  const buildInitial = useCallback((): DistrictState => {
    const state: DistrictState = {}
    for (const name of allNames) state[name] = "idle"
    return state
  }, [allNames])

  const [districts, setDistricts] = useState<DistrictState>(buildInitial)
  const [isOver, setIsOver] = useState(false)

  const total = allNames.length

  const correctCount = useMemo(
    () => Object.values(districts).filter((s) => s === "correct").length,
    [districts],
  )

  const missed = useMemo(
    () => allNames.filter((name) => districts[name] !== "correct"),
    [allNames, districts],
  )

  const guess = useCallback(
    (input: string): string | null => {
      if (isOver) return null

      const match = findMatch(input, allNames)
      if (!match) return null
      if (districts[match] === "correct") return null

      setDistricts((prev) => {
        const next = { ...prev, [match]: "correct" as const }
        const correct = Object.values(next).filter((s) => s === "correct").length
        if (correct === allNames.length) setIsOver(true)
        return next
      })

      return match
    },
    [allNames, districts, isOver],
  )

  const giveUp = useCallback(() => {
    setDistricts((prev) => {
      const next: DistrictState = { ...prev }
      for (const name of allNames) {
        if (next[name] !== "correct") next[name] = "revealed"
      }
      return next
    })
    setIsOver(true)
  }, [allNames])

  const reset = useCallback(() => {
    setDistricts(buildInitial())
    setIsOver(false)
  }, [buildInitial])

  return {
    districts,
    correctCount,
    total,
    isOver,
    missed,
    guess,
    giveUp,
    reset,
  }
}
