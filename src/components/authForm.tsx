"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { toast } from "sonner"; // Import directly from sonner
type Props={
    mode:string
}
export function LoginForm({mode}:Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({}); // Include name in errors

  function validate(form: FormData) {
    const nextErrors: typeof errors = {};
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = mode === "register" ? String(form.get("name") || "").trim() : "";

    if (!email) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email";

    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 8) nextErrors.password = "Must be at least 8 characters";

    if (mode === "register") {
      if (!name) nextErrors.name = "Name is required";
      else if (name.length < 2) nextErrors.name = "Name must be at least 2 characters";
    }

    return { nextErrors, email, password, name };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { nextErrors, email, password, name } = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      console.log("[v0] ", mode === "login" ? "Logging in" : "Registering", "with:", {
        email,
        passwordLength: password.length,
        name,
      });
      await new Promise((r) => setTimeout(r, 600));

      toast(
        mode === "login" ? "Logged in" : "Registered",
        {
          description: mode === "login" ? "Welcome back!" : "Account created successfully!",
          duration: 3000,
        }
      );
    } catch (err: any) {
      toast(
        mode === "login" ? "Login failed" : "Registration failed",
        {
          description: err?.message ?? "Something went wrong.",
          duration: 3000,
          style: { background: "#ef4444", color: "white" }, // Custom styling for error
        }
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "login" ? "Log in" : "Register"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === "login"
            ? "Enter your email and password to continue."
            : "Enter your details to create an account."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {/* Name (only for register) */}
          {mode === "register" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name ? (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              ) : null}
            </div>
          )}

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

        <CardFooter className="flex flex-col gap-3 mt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground"
          >
            {submitting
              ? mode === "login"
                ? "Signing in..."
                : "Registering..."
              : mode === "login"
              ? "Sign in"
              : "Register"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login"
              ? "Don’t have an account? "
              : "Already have an account? "}
            <button
              type="button"
             
              className="hover:underline underline-offset-4 text-foreground"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </CardFooter>
      </form>
    </>
  );
}