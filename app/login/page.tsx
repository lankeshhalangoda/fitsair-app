"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authenticate } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const isAuthenticated = authenticate(email, password)
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true") // Persist login state
      router.push("/dashboard")
    } else {
      setError("Invalid email or password.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-fitsair-dark-blue p-4">
      <Card className="w-full max-w-md bg-fitsair-white text-fitsair-dark-blue shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="flex flex-col items-center p-6 pb-4">
          <CardTitle className="text-3xl font-bold font-dm-serif-display">Welcome Back!</CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            Enter your credentials to access the survey application.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-lg">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@fitsair.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base focus-visible:ring-fitsair-dark-blue"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-lg">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base focus-visible:ring-fitsair-dark-blue"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-3 text-lg font-semibold transition-colors font-dm-serif-display"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
