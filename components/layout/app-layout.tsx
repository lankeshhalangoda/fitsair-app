"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import MobileNav from "./mobile-nav"
import { LogOut } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  pageTitle: string
  headerRight?: React.ReactNode // For custom right-side header content (e.g., close button)
}

export default function AppLayout({ children, pageTitle, headerRight }: AppLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.replace("/login")
  }

  return (
    <div className="flex flex-col min-h-screen bg-fitsair-dark-blue text-fitsair-white">
      <header className="flex items-center justify-between p-4 bg-fitsair-dark-blue border-b border-fitsair-white/20 shadow-md">
        <div className="flex items-center gap-4">
          <MobileNav onLogout={handleLogout} /> {/* Hamburger menu always present */}
          <Image src="/FitsAir-Logo.svg" alt="FitsAir Logo" width={100} height={50} />
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-dm-serif-display truncate max-w-[calc(100%-200px)]">
          {pageTitle}
        </h1>
        {headerRight ? (
          headerRight
        ) : (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-fitsair-white hover:bg-fitsair-white/10 hidden md:flex font-dm-serif-display" // Only show logout button on desktop
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        )}
      </header>
      {children}
      {/* Removed bottom navigation bar as hamburger menu is primary nav */}
    </div>
  )
}
