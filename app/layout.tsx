import type React from "react"
import type { Metadata } from "next"
import { DM_Serif_Display } from "next/font/google" // Import DM_Serif_Display
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // For toast notifications

// Configure DM Serif Display font
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400", // DM Serif Display typically has one weight
  variable: "--font-dm-serif-display", // Define CSS variable for DM Serif Display
  display: "swap",
})

export const metadata: Metadata = {
  title: "FitsAir Survey App",
  description: "Customer satisfaction survey application for FitsAir",
  manifest: "/manifest.webmanifest", // PWA manifest
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Apply DM Serif Display globally */}
      <body className={dmSerifDisplay.variable}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster /> {/* Add Toaster component */}
        </ThemeProvider>
      </body>
    </html>
  )
}
