"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/src/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})

  function validate(form: FormData) {
    const nextErrors: typeof errors = {}
    const email = String(form.get("email") || "").trim()
    const password = String(form.get("password") || "")

    if (!email) nextErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email"

    if (!password) nextErrors.password = "Password is required"
    else if (password.length < 8) nextErrors.password = "Must be at least 8 characters"

    return { nextErrors, email, password }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const { nextErrors, email, password } = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      setSubmitting(true)
      console.log("[v0] Logging in with:", { email, passwordLength: password.length })
      // Replace with your auth call or server action.
      await new Promise((r) => setTimeout(r, 600))

      toast({ title: "Logged in", description: "Welcome back!" })
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message ?? "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription className="text-muted-foreground">Enter your email and password to continue.</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            ) : null}
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password ? (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="#" className="hover:underline underline-offset-4 text-foreground">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </>
  )
}
