"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStoredSurveys, getStoredFlightNumbers, getUserProfile, addSurvey, addFlightNumber } from "@/lib/indexed-db"
import AppLayout from "@/components/layout/app-layout"

export default function DashboardPage() {
  const router = useRouter()
  const [surveys, setSurveys] = useState<{ id: number; name: string; url: string }[]>([])
  const [flightNumbers, setFlightNumbers] = useState<{ id: number; number: string }[]>([])
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [selectedFlightNumberId, setSelectedFlightNumberId] = useState<string | null>(null)
  const [userName, setUserName] = useState("FitsAir User")

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined" && !localStorage.getItem("isAuthenticated")) {
      router.replace("/login")
    }

    const loadData = async () => {
      // Pre-configure default survey and flight number if stores are empty
      const currentSurveys = await getStoredSurveys()
      if (currentSurveys.length === 0) {
        await addSurvey({ name: "General Feedback Survey", url: "https://emojot.com/fitsair" })
      }
      const currentFlightNumbers = await getStoredFlightNumbers()
      if (currentFlightNumbers.length === 0) {
        await addFlightNumber({ number: "FA123" })
      }

      // Load data after potential pre-configuration
      const updatedSurveys = await getStoredSurveys()
      const updatedFlightNumbers = await getStoredFlightNumbers()
      setSurveys(updatedSurveys)
      setFlightNumbers(updatedFlightNumbers)

      if (updatedSurveys.length > 0 && !selectedSurveyId) {
        setSelectedSurveyId(String(updatedSurveys[0].id))
      }
      if (updatedFlightNumbers.length > 0 && !selectedFlightNumberId) {
        setSelectedFlightNumberId(String(updatedFlightNumbers[0].id))
      }

      // Load user profile for greeting
      const profile = await getUserProfile()
      if (profile?.name) {
        setUserName(profile.name)
      }
    }
    loadData()
  }, [router, selectedSurveyId, selectedFlightNumberId])

  const handleLaunchSurvey = () => {
    if (selectedSurveyId && selectedFlightNumberId) {
      const survey = surveys.find((s) => String(s.id) === selectedSurveyId)
      const flight = flightNumbers.find((f) => String(f.id) === selectedFlightNumberId)
      if (survey && flight) {
        router.push(
          `/survey?url=${encodeURIComponent(survey.url)}&flight=${encodeURIComponent(flight.number)}&surveyName=${encodeURIComponent(survey.name)}`,
        )
      }
    }
  }

  return (
    <AppLayout pageTitle="Dashboard">
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-3xl font-bold font-dm-serif-display">Welcome, {userName}!</CardTitle>
            <p className="text-center text-muted-foreground mt-2">Launch a customer satisfaction survey.</p>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="survey-select" className="text-lg font-medium">
                Select Survey
              </Label>
              <Select value={selectedSurveyId || ""} onValueChange={setSelectedSurveyId}>
                <SelectTrigger id="survey-select" className="h-12 text-base focus:ring-fitsair-dark-blue">
                  <SelectValue placeholder="Select a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={String(survey.id)}>
                      {survey.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="flight-select" className="text-lg font-medium">
                Select Flight Number
              </Label>
              <Select value={selectedFlightNumberId || ""} onValueChange={setSelectedFlightNumberId}>
                <SelectTrigger id="flight-select" className="h-12 text-base focus:ring-fitsair-dark-blue">
                  <SelectValue placeholder="Select a flight number" />
                </SelectTrigger>
                <SelectContent>
                  {flightNumbers.map((flight) => (
                    <SelectItem key={flight.id} value={String(flight.id)}>
                      {flight.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleLaunchSurvey}
              disabled={!selectedSurveyId || !selectedFlightNumberId}
              className="w-full bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-3 text-lg font-semibold transition-colors font-dm-serif-display"
            >
              Launch Survey
            </Button>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  )
}
