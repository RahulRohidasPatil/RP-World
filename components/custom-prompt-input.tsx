import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { useRef, useState } from "react"
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
  PromptInputSpeechButton,
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
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(message: PromptInputMessage) {
    switch (status) {
      case "submitted":
      case "streaming": {
        stop()
        break
      }
      case "ready": {
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

  return (
    <PromptInput onSubmit={handleSubmit} multiple>
      <PromptInputHeader>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
      </PromptInputHeader>

      <PromptInputBody>
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          ref={textareaRef}
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
          <PromptInputSpeechButton
            onTranscriptionChange={setText}
            textareaRef={textareaRef}
          />
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputFooter>
    </PromptInput>
  )
}
