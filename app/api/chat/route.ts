import { type OpenAIResponsesProviderOptions, openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai("gpt-5.2"),
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: openai.tools.webSearch(),
      image_generation: openai.tools.imageGeneration({
        quality: "low",
        outputFormat: "webp",
        outputCompression: 100,
        background: "opaque",
      }),
      code_interpreter: openai.tools.codeInterpreter(),
    },
    providerOptions: {
      openai: {
        textVerbosity: "low",
      } satisfies OpenAIResponsesProviderOptions,
    },
  })

  return result.toUIMessageStreamResponse()
}
