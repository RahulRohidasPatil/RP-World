"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function Page() {
  async function handleClick() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/chat",
    })
  }

  return <Button onClick={handleClick}>Sign In with Google</Button>
}
