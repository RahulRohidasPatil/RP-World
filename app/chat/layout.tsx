import { Suspense } from "react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Layout({ children }: LayoutProps<"/chat">) {
  return (
    <div className="mx-auto flex h-dvh w-full flex-col gap-1 p-1 sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl 2xl:w-7xl">
      <div className="text-center">
        <ModeToggle />
      </div>
      <Suspense>{children}</Suspense>
    </div>
  )
}
