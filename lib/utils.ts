import type {
  FileUIPart,
  ReasoningUIPart,
  SourceUrlUIPart,
  TextUIPart,
  UIMessage,
} from "ai"
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
        case "source-url": {
          prev[1].push(curr)
          break
        }
        case "text":
        case "reasoning": {
          prev[2].push(curr)
          break
        }
      }
      return prev
    },
    [[], [], []] as [
      FileUIPart[],
      SourceUrlUIPart[],
      (TextUIPart | ReasoningUIPart)[],
    ],
  )
}

export function filterMessages(messages: UIMessage[]) {
  return messages
  // return messages.map((message) =>
  //   message.role === "assistant"
  //     ? {
  //         ...message,
  //         parts: message.parts.filter((part) => part.type !== "file"),
  //       }
  //     : message,
  // )
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
