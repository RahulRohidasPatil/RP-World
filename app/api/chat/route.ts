import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import type { models } from "@/lib/constants"

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: { messages: UIMessage[]; model: (typeof models)[number]["id"] } =
    await req.json()

  const result = streamText({
    model: google(model),
    messages: await convertToModelMessages(messages),
    tools: {
      code_execution: google.tools.codeExecution({}),
      google_search: google.tools.googleSearch({}),
      url_context: google.tools.urlContext({}),
    },
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: model === "gemini-3-pro-preview" ? "high" : "minimal",
          includeThoughts: true,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
  })

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
