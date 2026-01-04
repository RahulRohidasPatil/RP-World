"use client"

import { useChat } from "@ai-sdk/react"
import type {
  FileUIPart,
  ReasoningUIPart,
  SourceUrlUIPart,
  TextUIPart,
  UIMessage,
} from "ai"
import { MessageSquare } from "lucide-react"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageAttachment,
  MessageAttachments,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import CustomPromptInput from "@/components/custom-prompt-input"
import GeminiImage from "@/components/gemini-image"

function splitMessageParts(message: UIMessage) {
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

export default function Page() {
  const { messages, status, sendMessage, stop } = useChat()

  return (
    <>
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare />}
              title="Start a conversation"
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message) => {
              const [fileParts, sourceParts, responseParts] =
                splitMessageParts(message)

              return (
                <Message
                  key={message.id}
                  from={message.role}
                  className="text-justify"
                >
                  {message.role === "user" && fileParts.length > 0 && (
                    <MessageAttachments>
                      {fileParts.map((part) => (
                        <MessageAttachment data={part} key={part.url} />
                      ))}
                    </MessageAttachments>
                  )}

                  {responseParts.map((part, i) => {
                    switch (part.type) {
                      case "text": {
                        return (
                          <MessageContent key={`${message.id}-${i}`}>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        )
                      }
                      case "reasoning": {
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            isStreaming={
                              status === "streaming" &&
                              i === responseParts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        )
                      }
                      default: {
                        return null
                      }
                    }
                  })}

                  {message.role === "assistant" && (
                    <div className="flex flex-wrap gap-2">
                      {fileParts.map((part) => (
                        <GeminiImage key={part.url} src={part.url} />
                      ))}
                    </div>
                  )}

                  {message.role === "assistant" && (
                    <Sources>
                      <SourcesTrigger count={sourceParts.length} />
                      {sourceParts.map((part) => (
                        <SourcesContent key={part.sourceId}>
                          <Source href={part.url} title={part.title} />
                        </SourcesContent>
                      ))}
                    </Sources>
                  )}
                </Message>
              )
            })
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <CustomPromptInput
        status={status}
        sendMessage={sendMessage}
        stop={stop}
      />
    </>
  )
}
