"use client"

import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function RainWater() {
  const [arr, setArr] = useQueryState(
    "arr",
    parseAsArrayOf(parseAsInteger).withDefault([]),
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = e.target.value
      .split(",")
      .map((str) => parseInt(str, 10))
      .filter((num) => !Number.isNaN(num))
    setArr(parsed)
  }

  function handleRandom() {
    const newArr = Array.from({ length: Math.random() * 59 + 1 }, () =>
      Math.round(Math.random() * 30),
    )
    setArr(newArr)
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
              <div id="building">
                {height > 0 ? (
                  Array.from({ length: height }).map((level, idx) => (
                    <div
                      key={`${idx}-${level}`}
                      className="flex size-8 items-center justify-center bg-amber-300 text-xs"
                    >
                      {height - idx}
                    </div>
                  ))
                ) : (
                  <div className="size-8" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t text-center">Footer</div>
    </>
  )
}
