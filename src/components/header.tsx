"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"

export default function Header() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, call your logout API then redirect:
    // await fetch("/api/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="w-full border-b border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold text-pretty">Leads Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} aria-label="Logout">
          Logout
        </Button>
      </div>
    </header>
  )
}
