import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google"
import {
  convertToModelMessages,
  streamText,
  type ToolSet,
  type UIMessage,
} from "ai"
import type { ModelId } from "@/lib/types"

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: ModelId } =
    await req.json()

  const tools: ToolSet = {}
  const googleOptions: GoogleGenerativeAIProviderOptions = {}

  if (!model.includes("flash-image")) {
    tools.google_search = google.tools.googleSearch({})
    googleOptions.thinkingConfig = {
      thinkingLevel: model.includes("3-flash") ? "minimal" : undefined,
      includeThoughts: true,
    }

    if (!model.includes("image")) {
      tools.code_execution = google.tools.codeExecution({})
      tools.url_context = google.tools.urlContext({})
    }
  }

  const result = streamText({
    model: google(model),
    messages: await convertToModelMessages(messages),
    tools,
    providerOptions: {
      google: googleOptions,
    },
  })

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
