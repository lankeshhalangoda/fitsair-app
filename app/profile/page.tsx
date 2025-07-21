"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AppLayout from "@/components/layout/app-layout"
import { getUserProfile, updateUserProfile } from "@/lib/indexed-db"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  name: string
  email: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "" })

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined" && !localStorage.getItem("isAuthenticated")) {
      router.replace("/login")
    }
    loadProfile()
  }, [router])

  const loadProfile = async () => {
    const storedProfile = await getUserProfile()
    if (storedProfile) {
      setProfile(storedProfile)
    } else {
      // Set default mock profile if none exists
      setProfile({ name: "FitsAir User", email: "user@fitsair.com" })
    }
  }

  const handleSaveProfile = async () => {
    await updateUserProfile(profile)
    toast({
      title: "Profile Saved!",
      description: "Your profile details have been updated.",
    })
  }

  return (
    <AppLayout pageTitle="Profile">
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center font-dm-serif-display">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-lg">
                Name
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your Name"
                className="h-12 text-base focus-visible:ring-fitsair-dark-blue"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-lg">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
                className="h-12 text-base focus-visible:ring-fitsair-dark-blue"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-3 text-lg font-semibold transition-colors font-dm-serif-display"
            >
              Save Profile
            </Button>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  )
}
