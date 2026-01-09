import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { useState } from "react"
import { models } from "@/lib/constants"
import type { ModelId } from "@/lib/types"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "./ai-elements/prompt-input"

type Props = {
  messages: UIMessage[]
  status: UseChatHelpers<UIMessage>["status"]
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"]
  stop: UseChatHelpers<UIMessage>["stop"]
  setMessages: UseChatHelpers<UIMessage>["setMessages"]
}

export default function CustomPromptInput({
  messages,
  status,
  sendMessage,
  stop,
  setMessages,
}: Props) {
  const [text, setText] = useState<string>("")
  const [model, setModel] = useState<ModelId>(models[0].id)

  function handleSendMessage(message: PromptInputMessage) {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      { body: { model } },
    )
    setText("")
  }

  function handleSubmit(message: PromptInputMessage) {
    switch (status) {
      case "submitted":
      case "streaming": {
        stop()
        break
      }
      case "ready": {
        handleSendMessage(message)
        break
      }
      case "error": {
        setMessages(messages.slice(0, -1)) // remove last message
        handleSendMessage(message)
        break
      }
    }
  }

  function handleError(error: { code: string }) {
    if (error.code === "accept") {
      alert("Invalid file type. Please upload an Image or PDF.")
    }
  }

  return (
    <PromptInput
      onSubmit={handleSubmit}
      multiple
      accept="image/*,application/pdf"
      onError={handleError}
    >
      <PromptInputHeader>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
      </PromptInputHeader>

      <PromptInputBody>
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </PromptInputBody>

      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputSelect
            onValueChange={(value: ModelId) => {
              setModel(value)
            }}
            value={model}
          >
            <PromptInputSelectTrigger>
              <PromptInputSelectValue />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent position="popper">
              {models.map((model) => (
                <PromptInputSelectItem key={model.id} value={model.id}>
                  {model.name}
                </PromptInputSelectItem>
              ))}
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  )
}
