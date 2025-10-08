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
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
type Props={
    mode:string
}
export function LoginForm({mode}:Props) {
  const router=useRouter()
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({}); 
  const [error,setError]=React.useState('')
  const login = useAuthStore((state) => state.login);
  function validate(form: FormData) {
    const nextErrors: typeof errors = {};
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = mode === "signup" ? String(form.get("name") || "").trim() : "";

    if (!email) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email";

    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 8) nextErrors.password = "Must be at least 8 characters";

    if (mode === "signup") {
      if (!name) nextErrors.name = "Name is required";
      else if (name.length < 2) nextErrors.name = "Name must be at least 2 characters";
    }

    return { nextErrors, email, password, name };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setError('')
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { nextErrors, email, password, name } = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      const response = await axios.post(`/api/auth/${mode}`, {
        name,
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      console.log(response)
      if (response.status === 200) {
        localStorage.setItem("token", data.token); // Store token
        login(data.token, data.user); // Update auth store
        toast("Success", { description: "Redirecting..." });
        // Redirect to dashboard (e.g., router.push("/dashboard"))
      } else {
        throw new Error(data.error || "Unexpected response");
      }
    } catch (err: any) {
      console.log(err);
      if(err.status==400||err.status==401){
        setError(err.response.data.error)
      }
      const errorMessage = err.response?.data?.error || err.message || "Server error";
      toast("Error", {
        description: errorMessage,
        duration: 3000,
        style: { background: "#ef4444", color: "white" },
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "login" ? "Log in" : "Sign Up"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === "login"
            ? "Enter your email and password to continue."
            : "Enter your details to create an account."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {/* Name (only for signup) */}
          {mode === "signup" && (
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
<p className="text-sm text-red-800 flex text-center justify-center w-full mt-2">{error}</p>
        <CardFooter className="flex flex-col gap-3 mt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground"
          >
            {submitting
              ? mode === "login"
                ? "Signing in..."
                : "signuping..."
              : mode === "login"
              ? "Sign in"
              : "signup"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login"
              ? "Don’t have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                router.push(mode === "login" ? "/signup" : "/login");
              }}
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