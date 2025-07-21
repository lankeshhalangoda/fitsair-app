"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SplashScreen() {
  const router = useRouter()
  const [isLogoVisible, setIsLogoVisible] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  useEffect(() => {
    // Logo fade-in
    const logoTimer = setTimeout(() => {
      setIsLogoVisible(true)
    }, 200) // Small delay before logo appears

    // Button fade-in after logo animation
    const buttonTimer = setTimeout(() => {
      setIsButtonVisible(true)
    }, 1500) // Logo animation + slight delay

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  const handleWelcomeClick = () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-fitsair-dark-blue p-4">
      <div
        className={`transition-all duration-1000 ease-in-out ${
          isLogoVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <Image
          src="/FitsAir-Logo.svg"
          alt="FitsAir Logo"
          width={300}
          height={150}
          className="drop-shadow-lg"
          priority
        />
      </div>
      <div
        className={`mt-12 transition-opacity duration-700 ease-in-out ${
          isButtonVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Button
          onClick={handleWelcomeClick}
          className="bg-fitsair-white text-fitsair-dark-blue hover:bg-fitsair-white/90 px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 font-dm-serif-display"
        >
          Welcome
        </Button>
      </div>
    </div>
  )
}
