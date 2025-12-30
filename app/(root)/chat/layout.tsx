import { ModeToggle } from "@/components/mode-toggle"
import SignOutButton from "@/components/sign-out-button"

export default function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <div className="flex h-dvh flex-col gap-1 p-1">
      <header className="space-x-1 text-center">
        <ModeToggle />
        <SignOutButton />
      </header>
      <div className="mx-auto flex flex-1 flex-col gap-1 overflow-hidden sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl 2xl:w-7xl">
        {children}
      </div>
    </div>
  )
}
