"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function SignOutButton() {
  const router = useRouter()

  async function handleClick() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    })
  }

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <LogOut />
    </Button>
  )
}
