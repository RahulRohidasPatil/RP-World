import { requireSession } from "@/lib/auth"
import ChatClient from "./chat-client"

export default async function Page() {
  await requireSession()

  return <ChatClient />
}
