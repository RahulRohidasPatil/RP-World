import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Gemini 3 Pro",
}

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
}

export default function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <main className="container mx-auto flex h-[calc(100dvh-52px)] flex-col gap-2 overflow-hidden px-2 pb-2">
      {children}
    </main>
  )
}
