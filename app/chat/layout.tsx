"use cache"

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Gemini 3 Pro",
}

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
}

export default async function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <div className="container mx-auto flex h-[calc(100dvh-52px)] flex-col gap-2 overflow-hidden p-2">
      {children}
    </div>
  )
}
