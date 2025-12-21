export default function RainWater() {
  const arr = [3, 0, 1, 0, 4, 0, 2]

  return (
    <>
      <div className="border-b text-center">Header</div>

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
