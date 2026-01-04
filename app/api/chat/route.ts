import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google"
import {
  convertToModelMessages,
  streamText,
  type ToolSet,
  type UIMessage,
} from "ai"
import type { models } from "@/lib/constants"

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: { messages: UIMessage[]; model: (typeof models)[number]["id"] } =
    await req.json()

  const tools: ToolSet = {
    google_search: google.tools.googleSearch({}),
  }

  const isImageModel = model.includes("-image-")

  if (!isImageModel) {
    tools.code_execution = google.tools.codeExecution({})
    tools.url_context = google.tools.urlContext({})
  }

  const googleOptions: GoogleGenerativeAIProviderOptions = {
    thinkingConfig: {
      thinkingLevel: model.includes("-flash-") ? "minimal" : undefined,
      includeThoughts: true,
    },
  }

  if (isImageModel) {
    googleOptions.imageConfig = {
      // imageSize: "4K",
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
