import { Spinner } from "./ui/spinner"

export default function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  )
}
