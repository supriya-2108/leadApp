import type { Metadata } from "next"
import { Card } from "@/src/components/ui/card"
import { LoginForm } from "@/src/components/authForm"

export const metadata: Metadata = {
  title: "Log in",
  description: "Access your account",
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <section aria-labelledby="login-title" className="w-full max-w-md">
        <h1 id="login-title" className="sr-only">
          Log in
        </h1>
        <Card className="bg-card text-card-foreground shadow-sm">
          <LoginForm mode="login"/>
        </Card>
      </section>
    </main>
  )
}
