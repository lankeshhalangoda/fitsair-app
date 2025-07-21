"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Settings, ListChecks, User, LogOut, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface MobileNavProps {
  onLogout: () => void
}

export default function MobileNav({ onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-fitsair-white hover:bg-fitsair-white/10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-fitsair-dark-blue text-fitsair-white border-r border-fitsair-white/20 flex flex-col"
      >
        <SheetHeader className="pb-4 border-b border-fitsair-white/20">
          <SheetTitle className="flex items-center gap-2 text-fitsair-white">
            <Image src="/FitsAir-Logo.svg" alt="FitsAir Logo" width={80} height={40} />
            <span className="text-xl font-bold font-dm-serif-display">FitsAir App</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="grid gap-2 py-6 flex-1">
          {" "}
          {/* Reduced gap from gap-4 to gap-2 */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-fitsair-white hover:bg-fitsair-white/10 transition-colors text-lg font-dm-serif-display"
            onClick={closeSheet}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-fitsair-white hover:bg-fitsair-white/10 transition-colors text-lg font-dm-serif-display"
            onClick={closeSheet}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/offline-records"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-fitsair-white hover:bg-fitsair-white/10 transition-colors text-lg font-dm-serif-display"
            onClick={closeSheet}
          >
            <ListChecks className="h-5 w-5" />
            Offline Records
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-fitsair-white hover:bg-fitsair-white/10 transition-colors text-lg font-dm-serif-display"
            onClick={closeSheet}
          >
            <User className="h-5 w-5" />
            Profile
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t border-fitsair-white/20">
          <Button
            onClick={() => {
              onLogout()
              closeSheet()
            }}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 bg-fitsair-white text-fitsair-dark-blue hover:bg-fitsair-white/90 transition-colors text-lg font-dm-serif-display"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
