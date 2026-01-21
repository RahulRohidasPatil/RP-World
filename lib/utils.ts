import type { FileUIPart, TextUIPart, ToolUIPart, UIMessage } from "ai"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitMessageParts(message: UIMessage) {
  return message.parts.reduce(
    (prev, curr) => {
      switch (curr.type) {
        case "file": {
          prev[0].push(curr)
          break
        }
        case "text": {
          prev[1].push(curr)
          break
        }
        case "tool-image_generation": {
          prev[2].push(curr)
          break
        }
      }
      return prev
    },
    [[], [], []] as [FileUIPart[], TextUIPart[], ToolUIPart[]],
  )
}

export function handleCopy(message: UIMessage) {
  navigator.clipboard.writeText(
    message.parts.reduce((acc, part) => {
      switch (part.type) {
        case "text":
        case "reasoning":
          return acc + part.text
        default:
          return acc
      }
    }, ""),
  )
}
