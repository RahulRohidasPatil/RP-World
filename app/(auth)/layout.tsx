import { ModeToggle } from "@/components/mode-toggle"

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="space-x-1 text-center">
        <ModeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </>
  )
}
