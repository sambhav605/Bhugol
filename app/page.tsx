"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
// import { DISTRICTS } from "@/data/Districtsdata"
import { DISTRICTS } from "@/data/districtsData "
import { useGameState } from "@/hooks/useGameState"
import { useTimer } from "@/hooks/useTimer"
import { NepalMap } from "@/components/NepalMap"
import { HUD } from "@/components/HUD"
import { EndScreen } from "@/components/EndScreen"

export default function Page() {
  const allNames = useMemo(() => DISTRICTS.map((d) => d.name), [])

  const game = useGameState(allNames)
  const timer = useTimer({
    initialSeconds: 900,
    onExpire: () => game.giveUp(),
  })

  const [value, setValue] = useState("")
  const [flash, setFlash] = useState(false)
  const [started, setStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Stop the clock as soon as the game is over (all guessed / gave up / expired).
  useEffect(() => {
    if (game.isOver) timer.pause()
  }, [game.isOver, timer])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      setValue(next)

      if (!started && next.trim()) {
        setStarted(true)
        timer.start()
      }

      const matched = game.guess(next)
      if (matched) {
        setValue("")
        setFlash(true)
        window.setTimeout(() => setFlash(false), 250)
      }
    },
    [game, started, timer],
  )

  const handleGiveUp = useCallback(() => {
    game.giveUp()
  }, [game])

  const handlePlayAgain = useCallback(() => {
    game.reset()
    timer.reset()
    setValue("")
    setStarted(false)
    inputRef.current?.focus()
  }, [game, timer])

  return (
    <main className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-[900px]">
        <header className="mb-6 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
            Nepal Districts Quiz
          </h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            Type the name of all 77 districts of Nepal before the clock runs out.
          </p>
        </header>

        <HUD
          correctCount={game.correctCount}
          total={game.total}
          secondsLeft={timer.secondsLeft}
          isOver={game.isOver}
          onGiveUp={handleGiveUp}
        />

        <div className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            disabled={game.isOver}
            placeholder="Type a district name…"
            aria-label="District name guess"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`w-full rounded-md border bg-card px-4 py-3 text-base text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              flash
                ? "border-[#639922] ring-2 ring-[#639922]"
                : "border-border focus:border-ring focus:ring-ring/40"
            }`}
          />
        </div>

        <div className="relative mt-6 overflow-hidden rounded-lg border border-border bg-card p-2">
          <NepalMap districts={game.districts} />
        </div>

        {game.isOver && (
          <div className="mt-8">
            <EndScreen
              correctCount={game.correctCount}
              total={game.total}
              missed={game.missed}
              onPlayAgain={handlePlayAgain}
            />
          </div>
        )}
      </div>
    </main>
  )
}