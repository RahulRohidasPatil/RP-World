import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { useState } from "react"
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
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "./ai-elements/prompt-input"

type Props = {
  status: UseChatHelpers<UIMessage>["status"]
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"]
  stop: UseChatHelpers<UIMessage>["stop"]
}

export default function CustomPromptInput({
  status,
  sendMessage,
  stop,
}: Props) {
  const [text, setText] = useState<string>("")

  function handleSubmit(message: PromptInputMessage) {
    switch (status) {
      case "submitted":
      case "streaming": {
        stop()
        break
      }
      case "ready":
      case "error": {
        const hasText = Boolean(message.text)
        const hasAttachments = Boolean(message.files?.length)

        if (!(hasText || hasAttachments)) {
          return
        }

        sendMessage({
          text: message.text || "Sent with attachments",
          files: message.files,
        })
        setText("")
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
            <PromptInputActionMenuTrigger title="Add Attachments" />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  )
}
