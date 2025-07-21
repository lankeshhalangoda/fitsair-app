"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSurveyRecords, deleteSurveyRecord, addSurveyRecord } from "@/lib/indexed-db"
import { Trash2, RefreshCw } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

interface SurveyRecord {
  id?: number
  surveyName: string
  flightNumber: string
  timestamp: string
  submitted: boolean
  surveyUrl: string
}

export default function OfflineRecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<SurveyRecord[]>([])
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined" && !localStorage.getItem("isAuthenticated")) {
      router.replace("/login")
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    loadRecords()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [router])

  const loadRecords = async () => {
    setRecords(await getSurveyRecords())
  }

  const handleDeleteRecord = async (id: number) => {
    await deleteSurveyRecord(id)
    loadRecords()
  }

  const handleSyncRecords = async () => {
    if (!isOnline) {
      alert("You are currently offline. Please connect to the internet to sync records.")
      return
    }

    const unsubmittedRecords = records.filter((record) => !record.submitted)
    if (unsubmittedRecords.length === 0) {
      alert("No unsubmitted records to sync.")
      return
    }

    alert(`Attempting to sync ${unsubmittedRecords.length} records... (This is a mock submission)`)

    for (const record of unsubmittedRecords) {
      // In a real app, you would send this data to your backend
      console.log("Submitting record:", record)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (record.id) {
        // Mark as submitted in IndexedDB by updating the record
        await addSurveyRecord({ ...record, submitted: true }) // Re-add with submitted: true
        await deleteSurveyRecord(record.id) // Delete old record
      }
    }
    alert("Sync complete! (Mock submission)")
    loadRecords() // Reload records to reflect submitted status
  }

  return (
    <AppLayout pageTitle="Offline Records">
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto grid gap-4">
          <Card className="bg-fitsair-white text-fitsair-dark-blue p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-bold font-dm-serif-display">Stored Survey Records</CardTitle>
              <Button
                onClick={handleSyncRecords}
                disabled={!isOnline || records.every((r) => r.submitted)}
                className="bg-fitsair-dark-blue hover:bg-fitsair-dark-blue/90 text-fitsair-white py-2 px-4 text-base font-semibold transition-colors font-dm-serif-display"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Records
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                {isOnline ? "You are online." : "You are offline."} Unsubmitted records will be synced when online.
              </p>
              {records.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No survey records stored yet.</p>
              ) : (
                <ul className="grid gap-3">
                  {records.map((record) => (
                    <li key={record.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium truncate">
                          {record.surveyName} (Flight: {record.flightNumber})
                        </p>
                        <p className="text-sm text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</p>
                        <p
                          className={`text-sm font-semibold ${record.submitted ? "text-green-600" : "text-orange-600"}`}
                        >
                          Status: {record.submitted ? "Submitted" : "Pending Sync"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => record.id && handleDeleteRecord(record.id)}>
                        <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
                        <span className="sr-only">Delete record</span>
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
