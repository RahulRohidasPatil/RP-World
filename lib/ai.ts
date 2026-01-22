import {
  type ChatTransport,
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai"
import { createOllama } from "ai-sdk-ollama"

const ollama = createOllama({
  baseURL: process.env.NEXT_PUBLIC_OLLAMA_URL,
})

export class CustomTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]) {
    const result = streamText({
      model: ollama("gemma3:1b"),
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStream()
  }

  async reconnectToStream() {
    return null
  }
}
