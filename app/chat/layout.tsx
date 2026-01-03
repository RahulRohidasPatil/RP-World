import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Chatbot",
  description: "Gemini 3 Pro",
}

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
}

export default async function Layout({ children }: LayoutProps<"/chat">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="container mx-auto flex h-[calc(100dvh-52px)] flex-col gap-2 overflow-hidden p-2">
      {children}
    </div>
  )
}
