"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { addSurveyRecord } from "@/lib/indexed-db"
import { X } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

export default function SurveyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const surveyUrl = searchParams.get("url")
  const flightNumber = searchParams.get("flight")
  const surveyName = searchParams.get("surveyName")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("isAuthenticated")) {
      router.replace("/login")
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [router])

  const handleCloseSurvey = async () => {
    if (surveyUrl && flightNumber && surveyName) {
      await addSurveyRecord({
        surveyName: surveyName,
        flightNumber: flightNumber,
        timestamp: new Date().toISOString(),
        submitted: isOnline,
        surveyUrl: surveyUrl,
      })
    }
    router.push("/dashboard")
  }

  if (!surveyUrl) {
    return (
      <AppLayout pageTitle="Survey Error">
        <div className="flex items-center justify-center flex-1 p-4">
          <Card className="p-6 bg-fitsair-white text-fitsair-dark-blue shadow-xl text-center">
            <h2 className="text-2xl font-bold font-dm-serif-display mb-4">Error</h2>
            <p className="mb-6">No survey URL provided. Please select a survey from the dashboard.</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-2 px-4 text-base font-semibold transition-colors font-dm-serif-display"
            >
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      pageTitle={`Survey: ${surveyName || "Unknown"}`}
      headerRight={
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCloseSurvey}
          className="text-fitsair-white hover:bg-fitsair-white/10"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close Survey</span>
        </Button>
      }
    >
      <main className="flex-1 flex flex-col px-4 pb-2 pt-4 h-[calc(100vh-100px)]"> {/* 100px = header + margin */}
        <Card className="flex-1 flex flex-col bg-fitsair-white text-fitsair-dark-blue shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <CardContent className="flex-1 p-0">
            <iframe
              src={surveyUrl}
              className="w-full h-full min-h-[500px] border-0"
              title="Customer Survey"
              allowFullScreen
            ></iframe>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <p className="text-sm text-fitsair-white mb-2">
            {isOnline ? "You are online." : "You are offline. Survey records will be stored locally."}
          </p>
          <Button
            onClick={handleCloseSurvey}
            className="bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-2 px-4 text-base font-semibold transition-colors font-dm-serif-display"
          >
            Mark Survey as Completed & Close
          </Button>
        </div>
      </main>
    </AppLayout>
  )
}
