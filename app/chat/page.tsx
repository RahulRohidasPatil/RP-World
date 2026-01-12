"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Copy, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageAction,
  MessageActions,
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
import CustomPromptInput from "@/components/custom/custom-prompt-input"
import GeminiImage from "@/components/custom/gemini-image"
import { filterMessages, handleCopy, splitMessageParts } from "@/lib/utils"

export default function Page() {
  const { messages, status, sendMessage, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages, body }) => ({
        body: {
          ...body,
          messages: filterMessages(messages),
        },
      }),
    }),
    onError: (error) => {
      toast.error(error.message)
    },
  })

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

                  {message.role === "assistant" && fileParts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {fileParts.map((part, i) => (
                        <GeminiImage
                          key={`${message.id}-${i}`}
                          src={part.url}
                        />
                      ))}
                    </div>
                  )}

                  <MessageActions
                    className={
                      message.role === "user" ? "justify-end" : "justify-start"
                    }
                  >
                    <MessageAction
                      label="Copy"
                      onClick={() => handleCopy(message)}
                    >
                      <Copy />
                    </MessageAction>
                    <MessageAction
                      label="Delete"
                      onClick={() => {
                        setMessages(messages.filter((m) => m.id !== message.id))
                      }}
                    >
                      <Trash2 />
                    </MessageAction>
                  </MessageActions>

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
