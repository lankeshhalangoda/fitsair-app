"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  addSurvey,
  getStoredSurveys,
  deleteSurvey,
  addFlightNumber,
  getStoredFlightNumbers,
  deleteFlightNumber,
} from "@/lib/indexed-db"
import { Trash2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const router = useRouter()
  const [newSurveyName, setNewSurveyName] = useState("")
  const [newSurveyUrl, setNewSurveyUrl] = useState("")
  const [newFlightNumber, setNewFlightNumber] = useState("")
  const [surveys, setSurveys] = useState<{ id: number; name: string; url: string }[]>([])
  const [flightNumbers, setFlightNumbers] = useState<{ id: number; number: string }[]>([])

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined" && !localStorage.getItem("isAuthenticated")) {
      router.replace("/login")
    }
    loadSettings()
  }, [router])

  const loadSettings = async () => {
    setSurveys(await getStoredSurveys())
    setFlightNumbers(await getStoredFlightNumbers())
  }

  const handleAddSurvey = async () => {
    if (newSurveyName && newSurveyUrl) {
      await addSurvey({ name: newSurveyName, url: newSurveyUrl })
      setNewSurveyName("")
      setNewSurveyUrl("")
      loadSettings()
    }
  }

  const handleDeleteSurvey = async (id: number) => {
    await deleteSurvey(id)
    loadSettings()
  }

  const handleAddFlightNumber = async () => {
    if (newFlightNumber) {
      await addFlightNumber({ number: newFlightNumber })
      setNewFlightNumber("")
      loadSettings()
    }
  }

  const handleDeleteFlightNumber = async (id: number) => {
    await deleteFlightNumber(id)
    loadSettings()
  }

  return (
    <AppLayout pageTitle="Settings">
      <main className="flex-1 p-4 overflow-auto">
        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Add New Survey */}
          <Card className="bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold font-dm-serif-display">Add New Survey</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="survey-name" className="text-lg">
                  Survey Name
                </Label>
                <Input
                  id="survey-name"
                  value={newSurveyName}
                  onChange={(e) => setNewSurveyName(e.target.value)}
                  placeholder="e.g., General Feedback Survey"
                  className="h-10 text-base focus-visible:ring-fitsair-dark-blue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="survey-url" className="text-lg">
                  Survey URL
                </Label>
                <Input
                  id="survey-url"
                  type="url"
                  value={newSurveyUrl}
                  onChange={(e) => setNewSurveyUrl(e.target.value)}
                  placeholder="e.g., https://emojot.com/titusonline"
                  className="h-10 text-base focus-visible:ring-fitsair-dark-blue"
                />
              </div>
              <Button
                onClick={handleAddSurvey}
                className="bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-2 text-base font-semibold transition-colors font-dm-serif-display"
              >
                Add Survey
              </Button>
            </CardContent>
          </Card>

          {/* Existing Surveys */}
          <Card className="bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold font-dm-serif-display">Existing Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              {surveys.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No surveys added yet.</p>
              ) : (
                <ul className="grid gap-3">
                  {surveys.map((survey) => (
                    <li key={survey.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium truncate">{survey.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{survey.url}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSurvey(survey.id)}>
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
                        <span className="sr-only">Delete survey</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Separator className="my-4 bg-fitsair-white/20" />

          {/* Add New Flight Number */}
          <Card className="bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold font-dm-serif-display">Add New Flight Number</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="flight-number" className="text-lg">
                  Flight Number
                </Label>
                <Input
                  id="flight-number"
                  value={newFlightNumber}
                  onChange={(e) => setNewFlightNumber(e.target.value)}
                  placeholder="e.g., FA123"
                  className="h-10 text-base focus-visible:ring-fitsair-dark-blue"
                />
              </div>
              <Button
                onClick={handleAddFlightNumber}
                className="bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-2 text-base font-semibold transition-colors font-dm-serif-display"
              >
                Add Flight Number
              </Button>
            </CardContent>
          </Card>

          {/* Existing Flight Numbers */}
          <Card className="bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold font-dm-serif-display">Existing Flight Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              {flightNumbers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No flight numbers added yet.</p>
              ) : (
                <ul className="grid gap-3">
                  {flightNumbers.map((flight) => (
                    <li key={flight.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <p className="font-medium">{flight.number}</p>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteFlightNumber(flight.id)}>
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
                        <span className="sr-only">Delete flight number</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  )
}
