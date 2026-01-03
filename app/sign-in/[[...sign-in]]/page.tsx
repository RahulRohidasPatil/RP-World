"use cache"

import { SignIn } from "@clerk/nextjs"

export default async function Page() {
  return (
    <div className="mt-4 flex justify-center">
      <SignIn />
    </div>
  )
}
