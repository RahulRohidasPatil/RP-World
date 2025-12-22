"use client"

import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function RainWater() {
  const [arr, setArr] = useQueryState(
    "arr",
    parseAsArrayOf(parseAsInteger).withDefault([]),
  )

  const [lMax, setLMax] = useState(0)
  const [rMax, setRMax] = useState(arr.length - 1)
  const [left, setLeft] = useState(1)
  const [right, setRight] = useState(arr.length - 2)
  const [result, setResult] = useState(0)

  function reset(newArr: number[]) {
    setArr(newArr)
    setLMax(0)
    setRMax(newArr.length - 1)
    setLeft(1)
    setRight(newArr.length - 2)
    setResult(0)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    reset(
      e.target.value
        .split(",")
        .map((str) => parseInt(str, 10))
        .filter((num) => !Number.isNaN(num)),
    )
  }

  function handleRandom() {
    reset(
      Array.from({ length: Math.random() * 59 + 1 }, () =>
        Math.round(Math.random() * 30),
      ),
    )
  }

  function handleNext() {}

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
        <Button onClick={handleNext}>Next</Button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-end border p-1">
          {arr.map((height, index) => (
            <div key={`${index}-${height}`}>
              {/* <div id="water">
                <div className="size-8 bg-blue-300"></div>
              </div> */}
              <div
                id="building"
                className={cn(
                  "w-8 bg-amber-300",
                  index === lMax && "bg-blue-300",
                  index === rMax && "bg-cyan-300",
                  index === left && "bg-emerald-300",
                  index === right && "bg-fuchsia-300",
                )}
              >
                {Array.from({ length: height }).map((level, idx) => (
                  <div
                    key={`${idx}-${level}`}
                    className="flex size-8 items-center justify-center text-xs"
                  >
                    {height - idx}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-1 border-t p-1">
        <div className="bg-blue-300 p-1">lMax: {lMax}</div>
        <div className="bg-emerald-300 p-1">left: {left}</div>
        <div className="bg-fuchsia-300 p-1">right: {right}</div>
        <div className="bg-cyan-300 p-1">rMax: {rMax}</div>
        <div className="bg-orange-300 p-1">result: {result}</div>
      </div>
    </>
  )
}
