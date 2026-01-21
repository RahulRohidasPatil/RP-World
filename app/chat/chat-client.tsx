"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { AlertCircleIcon, Copy, MessageSquare, Trash2, X } from "lucide-react"
import { useState } from "react"
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
import CustomPromptInput from "@/components/custom-prompt-input"
import GeminiImage from "@/components/gemini-image"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { filterMessages, handleCopy, splitMessageParts } from "@/lib/utils"

export default function ChatClient() {
  const [error, setError] = useState("")

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
      // toast.error(error.message)
      setError(error.message)
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
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction onClick={() => setError("")}>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </AlertAction>
        </Alert>
      )}
      <CustomPromptInput
        status={status}
        sendMessage={sendMessage}
        stop={stop}
      />
    </>
  )
}
