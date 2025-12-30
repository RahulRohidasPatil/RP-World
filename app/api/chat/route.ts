import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google("gemini-3-pro-preview"),
    messages: await convertToModelMessages(messages),
    tools: {
      code_execution: google.tools.codeExecution({}),
      google_search: google.tools.googleSearch({}),
      url_context: google.tools.urlContext({}),
    },
    providerOptions: {
      google: {
        thinkingConfig: {
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
