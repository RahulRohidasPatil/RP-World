"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function SignOutButton() {
  const { data: session } = authClient.useSession()
  const router = useRouter()

  async function handleClick() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
        },
      },
    })
  }

  return session ? (
    <Button variant="outline" size="icon-sm" onClick={handleClick}>
      <LogOut />
      <span className="sr-only">Sign out</span>
    </Button>
  ) : null
}
