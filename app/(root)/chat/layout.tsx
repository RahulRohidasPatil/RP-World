import type { Metadata, Viewport } from "next"
import { ModeToggle } from "@/components/mode-toggle"
import SignOutButton from "@/components/sign-out-button"

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Gemini 3 Pro",
}

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
}

export default function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <div className="flex h-dvh flex-col gap-1 p-1">
      <header className="space-x-1 text-center">
        <ModeToggle />
        <SignOutButton />
      </header>
      <div className="container mx-auto flex flex-1 flex-col gap-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
