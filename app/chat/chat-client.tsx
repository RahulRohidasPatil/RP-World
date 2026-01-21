"use client"

import { useChat } from "@ai-sdk/react"
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
import AiImage from "@/components/ai-image"
import CustomPromptInput from "@/components/custom-prompt-input"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { handleCopy, splitMessageParts } from "@/lib/utils"

export default function ChatClient() {
  const [error, setError] = useState("")

  const { messages, status, sendMessage, stop, setMessages } = useChat({
    onError(err) {
      setError(err.message)
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
              const [fileParts, textParts, imageParts] =
                splitMessageParts(message)

              return (
                <Message
                  key={message.id}
                  from={message.role}
                  className="text-justify"
                >
                  {fileParts.length > 0 && (
                    <MessageAttachments>
                      {fileParts.map((part) => (
                        <MessageAttachment data={part} key={part.url} />
                      ))}
                    </MessageAttachments>
                  )}

                  {textParts.map((part, i) => (
                    <MessageContent key={`${message.id}-${i}`}>
                      <MessageResponse>{part.text}</MessageResponse>
                    </MessageContent>
                  ))}

                  {imageParts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {imageParts.map((part, i) => {
                        const output = part.output

                        if (
                          !(
                            output &&
                            typeof output === "object" &&
                            "result" in output
                          )
                        ) {
                          return null
                        }

                        return (
                          <AiImage
                            key={`${message.id}-${i}`}
                            src={`data:image/webp;base64,${output.result}`}
                          />
                        )
                      })}
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
