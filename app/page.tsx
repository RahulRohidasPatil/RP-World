import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex h-dvh flex-col gap-1 p-1">
      <header className="text-center">
        <ModeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center">Rahul Patil</div>
    </div>
  )
}
