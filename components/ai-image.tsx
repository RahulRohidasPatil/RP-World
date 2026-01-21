"use client"

import Image from "next/image"
import { type SyntheticEvent, useState } from "react"
import { ImageZoom } from "./kibo-ui/image-zoom"

export default function AiImage({ src }: { src: string }) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9)

  function handleLoadingComplete(e: SyntheticEvent<HTMLImageElement, Event>) {
    const ratio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight
    setAspectRatio(ratio)
  }

  return (
    <ImageZoom>
      <div className="relative min-h-37.5 min-w-37.5" style={{ aspectRatio }}>
        <Image
          src={src}
          alt="AI generated image"
          fill
          onLoad={handleLoadingComplete}
        />
      </div>
    </ImageZoom>
  )
}
