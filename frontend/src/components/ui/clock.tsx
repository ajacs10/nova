"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SecondsMode = "smooth" | "tick1" | "tick2" | "highFreq"

interface ClockProps {
  initialTime?: Date
  timeZone?: string
  initialSecondsMode?: SecondsMode
}

export function Clock({
  initialTime = new Date(),
  timeZone = "Asia/Calcutta",
  initialSecondsMode = "smooth",
}: ClockProps) {
  const [time, setTime] = useState(initialTime)
  // secondsMode is intentionally not given a setter, as it's meant to be static after initial render
  const [secondsMode] = useState<SecondsMode>(initialSecondsMode)

  const hourHandRef = useRef<HTMLDivElement>(null)
  const minuteHandRef = useRef<HTMLDivElement>(null)
  const secondHandContainerRef = useRef<HTMLDivElement>(null)
  const secondHandShadowRef = useRef<HTMLDivElement>(null)

  const updateClockHands = useCallback(() => {
    const now = new Date()
    const displayTime = new Date(
      now.toLocaleString("en-US", {
        timeZone: timeZone,
      })
    )
    const hours = displayTime.getHours() % 12
    const minutes = displayTime.getMinutes()
    const seconds = displayTime.getSeconds()
    const milliseconds = displayTime.getMilliseconds()

    const hoursDegrees = hours * 30 + (minutes / 60) * 30
    const minutesDegrees = minutes * 6 + (seconds / 60) * 0.1

    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `rotate(${hoursDegrees}deg)`
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `rotate(${minutesDegrees}deg)`
    }

    let currentSecondsAngle = 0

    switch (secondsMode) {
      case "tick1": // Tick every second (60 ticks per minute)
        currentSecondsAngle = seconds * 6
        break
      case "tick2": // Half-second ticks (120 ticks per minute)
        currentSecondsAngle =
          Math.floor((seconds * 1000 + milliseconds) / 500) * 3
        break
      case "highFreq": // High-frequency sweep (8 ticks per second)
        currentSecondsAngle = ((seconds * 1000 + milliseconds) / 125) * 0.75
        break
      case "smooth": // Smooth movement over 60 seconds
      default:
        currentSecondsAngle = seconds * 6 + (milliseconds / 1000) * 6
        break
    }

    const secondHandTransform = `rotate(${currentSecondsAngle}deg)`
    if (secondHandContainerRef.current) {
      secondHandContainerRef.current.style.transform = secondHandTransform
    }

    if (secondHandShadowRef.current) {
      secondHandShadowRef.current.style.transform = `rotate(${currentSecondsAngle + 0.5}deg)`
    }
  }, [secondsMode, timeZone])

  useEffect(() => {
    updateClockHands()

    const minuteInterval = setInterval(() => {
      const now = new Date()
      setTime(new Date(now.toLocaleString("en-US", { timeZone })))
      updateClockHands()
    }, 60000)

    let animationFrameId: number
    const animateSeconds = () => {
      updateClockHands()
      animationFrameId = requestAnimationFrame(animateSeconds)
    }
    animateSeconds()

    return () => {
      clearInterval(minuteInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [timeZone, updateClockHands])

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const dateDisplay = `${months[time.getMonth()]} ${time.getDate()}`

  const hourMarks = []
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) {
      const hourIndex = i / 5
      const angle = (i * 6 * Math.PI) / 180
      const radius = 145
      const left = 175 + Math.sin(angle) * radius - 15
      const top = 175 - Math.cos(angle) * radius - 10
      hourMarks.push(
        <div
          key={`num-${i}`}
          className="pointer-events-none absolute h-[20px] w-[30px] text-center leading-[20px] select-none text-white/80"
          style={{
            left: `${left}px`,
            top: `${top}px`,
            fontSize: "16px",
            fontWeight: 500,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            zIndex: 15,
          }}
        >
          {hourIndex === 0 ? "12" : hourIndex.toString()}
        </div>
      )
    } else {
      hourMarks.push(
        <div
          key={`mark-${i}`}
          className="absolute top-[10px] left-[175px] h-[10px] w-[1px] shadow-[0_0_2px_rgba(255,255,255,0.02)]"
          style={{
            backgroundColor: "rgba(180, 180, 180, 0.4)",
            transformOrigin: "center 165px",
            transform: `rotate(${i * 6}deg)`,
            opacity: 1,
          }}
        />
      )
    }
  }

  return (
    <div className="clock-widget relative flex flex-col items-center justify-center p-2">
      <div className="clock-shell relative z-10 flex h-[360px] w-[360px] items-center justify-center">
        <div className="transform-style-preserve-3d group pointer-events-none relative z-10 rounded-full bg-transparent transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform backface-hidden perspective-[1000px]">
          <div
            className="clock-face transform-style-preserve-3d will-change-transform-box-shadow pointer-events-auto relative z-20 h-[360px] w-[360px] cursor-pointer overflow-hidden rounded-full bg-[rgba(255,255,255,0.03)] shadow-[inset_0_0.4em_0.4em_rgba(0,0,0,0.1),inset_0_-0.4em_0.4em_rgba(255,255,255,0.5)] backdrop-blur-[1px] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] select-none backface-hidden"
            style={{
              backgroundImage:
                "linear-gradient(-75deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))",
              boxShadow: `inset 0 0.4em 0.4em rgba(0, 0, 0, 0.1), inset 0 -0.4em 0.4em rgba(255, 255, 255, 0.2), 10px 5px 10px rgba(0, 0, 0, 0.1), 10px 20px 20px rgba(0, 0, 0, 0.02), 10px 55px 50px rgba(0, 0, 0, 0.02)`,
            }}
          >
            <div className="border-foreground pointer-events-none absolute top-0 left-0 z-10 h-[360px] w-[360px] rounded-full border opacity-60 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

            <div className="border-foreground pointer-events-none absolute top-[-3px] left-[-3px] z-10 h-[366px] w-[366px] rounded-full border opacity-60 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

            <div
              className="pointer-events-none absolute top-0 left-0 z-10 h-[360px] w-[360px] rounded-full shadow-[inset_-5px_5px_15px_rgba(0,0,0,0.3),inset_-8px_8px_20px_rgba(0,0,0,0.2)]"
              style={{ opacity: 0.15 }}
            />
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-[180px] w-[360px] rounded-t-[180px] mix-blend-soft-light blur-md" />

            <div className="pointer-events-none absolute top-[10px] left-[10px] z-20 h-[340px] w-[340px] rounded-full mix-blend-overlay blur-md" />
            <div className="absolute top-0 left-0 z-10 h-full w-full">
              {hourMarks}
            </div>
            <div
              ref={hourHandRef}
              className="absolute bottom-[180px] left-[180px] z-20 ml-[-3px] h-[75px] w-[6px] rounded-[3px] shadow-[0_0_5px_rgba(0,0,0,0.5)] will-change-transform"
              style={{
                transformOrigin: "center bottom",
                backgroundColor: "rgba(230, 230, 230, 0.95)",
              }}
            />
            <div
              ref={minuteHandRef}
              className="absolute bottom-[180px] left-[180px] z-20 ml-[-2px] h-[105px] w-[4px] rounded-[2px] shadow-[0_0_5px_rgba(0,0,0,0.5)] will-change-transform"
              style={{
                transformOrigin: "center bottom",
                backgroundColor: "rgba(230, 230, 230, 0.95)",
              }}
            />
            <div
              ref={secondHandContainerRef}
              className="absolute top-[55px] left-[179px] z-20 h-[125px] w-[2px] will-change-transform"
              style={{ transformOrigin: "1px 125px" }}
            >
              <div
                className={`absolute bottom-0 left-0 h-[125px] w-[2px] shadow-[0_0_8px_rgba(0,210,181,0.8)]`}
                style={{ backgroundColor: "#00d2b5" }}
              />
              <div
                className={`absolute bottom-[-14px] left-[-2px] h-[14px] w-[6px] rounded-b-[4px] shadow-[0_0_8px_rgba(0,210,181,0.8)]`}
                style={{ backgroundColor: "#00d2b5" }}
              />
            </div>

            <div
              className="pointer-events-none absolute top-[162px] left-[162px] z-20 h-[36px] w-[36px] rounded-full backdrop-blur-[2px]"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                boxShadow:
                  "0 0 20px rgba(255, 255, 255, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.6)",
              }}
            />

            <div className="clock-date text-white/80 pointer-events-none absolute bottom-[118px] left-[110px] z-10 h-auto w-[140px] text-center text-xs leading-none font-semibold select-none">
              {dateDisplay}
            </div>
            <div className="clock-timezone text-white/60 pointer-events-none absolute bottom-[98px] left-[110px] z-10 h-auto w-[140px] text-center text-xs leading-none select-none">
              {timeZone}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 560px) {
          .clock-shell {
            width: 120px !important;
            height: 120px !important;
          }

          .clock-face {
            width: 120px !important;
            height: 120px !important;
            transform: scale(0.34) !important;
            transform-origin: center center !important;
          }

          .clock-date,
          .clock-timezone {
            transform: scale(0.72) !important;
            transform-origin: center center !important;
            opacity: 0.8 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Clock
