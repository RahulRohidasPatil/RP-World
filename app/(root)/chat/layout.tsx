import { Suspense } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import SignOutButton from "@/components/sign-out-button"

export default function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <>
      <header className="space-x-1 text-center">
        <ModeToggle />
        <SignOutButton />
      </header>
      <Suspense>{children}</Suspense>
    </>
  )
}
