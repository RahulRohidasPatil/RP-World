"use client"

import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs"
import { useRef, useState } from "react"
import { useMap, useResizeObserver } from "usehooks-ts"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

export default function TrappingRainWater() {
  const [arr, setArr] = useQueryState(
    "arr",
    parseAsArrayOf(parseAsInteger).withDefault([]),
  )

  const [lMax, setLMax] = useState(0)
  const [rMax, setRMax] = useState(arr.length - 1)
  const [left, setLeft] = useState(1)
  const [right, setRight] = useState(arr.length - 2)
  const [result, setResult] = useState(0)
  const [waterLevels, actions] = useMap<number, number>()

  const ref = useRef<HTMLDivElement>(null)
  const { width = 0, height = 0 } = useResizeObserver({
    ref: ref as React.RefObject<HTMLElement>,
    box: "border-box",
  })

  function reset(newArr: number[]) {
    setArr(newArr)
    setLMax(0)
    setRMax(newArr.length - 1)
    setLeft(1)
    setRight(newArr.length - 2)
    setResult(0)
    actions.reset()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newArr = e.target.value.split(",").reduce<number[]>((acc, str) => {
      const num = parseInt(str, 10)
      if (!Number.isNaN(num) && num < 100) acc.push(num)
      return acc
    }, [])

    reset(newArr)
  }

  function handleRandom() {
    const newArr = Array.from({ length: Math.random() * 99 + 1 }, () =>
      Math.round(Math.random() * 99),
    )

    reset(newArr)
  }

  function handleNext() {
    let waterLevel = 0

    if (arr[lMax] < arr[rMax]) {
      waterLevel = Math.max(0, arr[lMax] - arr[left])
      actions.set(left, waterLevel)

      setLMax(arr[left] < arr[lMax] ? lMax : left)
      setLeft(left + 1)
    } else {
      waterLevel = Math.max(0, arr[rMax] - arr[right])
      actions.set(right, waterLevel)

      setRMax(arr[right] < arr[rMax] ? rMax : right)
      setRight(right - 1)
    }

    setResult(result + waterLevel)
  }

  return (
    <>
      <div className="flex items-center space-x-1 border-b p-1">
        <Input
          placeholder="Enter heights separated by commas"
          className="text-center"
          defaultValue={arr.join(",")}
          onChange={handleChange}
        />
        <Button onClick={handleRandom}>Random</Button>
        <Button onClick={handleNext} disabled={left > right}>
          Next
        </Button>
      </div>

      <div className="flex-1" ref={ref}>
        <ScrollArea style={{ height, width }}>
          <div
            className="flex items-center justify-center"
            style={{ minHeight: height, minWidth: width }}
          >
            <div className="flex items-end border p-1">
              {arr.map((height, index) => (
                <div key={`${index}-${height}`} className="text-center text-xs">
                  <div id="water" className="bg-cyan-300">
                    {Array.from({ length: waterLevels.get(index) || 0 }).map(
                      (level, idx) => (
                        <div key={`${idx}-${level}`} className="h-6 w-8"></div>
                      ),
                    )}
                  </div>
                  <div
                    id="building"
                    className={cn("w-8 bg-amber-300", {
                      "bg-emerald-400": index === lMax,
                      "bg-emerald-300": index === left,
                      "bg-fuchsia-300": index === right,
                      "bg-fuchsia-400": index === rMax,
                      "bg-amber-300": left > right,
                    })}
                  >
                    {Array.from({ length: height }).map((level, idx) => (
                      <div
                        key={`${idx}-${level}`}
                        className="flex items-center justify-center p-1"
                      >
                        {height - idx}
                      </div>
                    ))}
                  </div>
                  <span>{index}</span>
                </div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex justify-center space-x-1 border-t p-1">
        <div className="bg-emerald-400 p-1">lMax: {lMax}</div>
        <div className="bg-emerald-300 p-1">left: {left}</div>
        <div className="bg-fuchsia-300 p-1">right: {right}</div>
        <div className="bg-fuchsia-400 p-1">rMax: {rMax}</div>
        <div className="bg-cyan-300 p-1">result: {result}</div>
      </div>
    </>
  )
}
