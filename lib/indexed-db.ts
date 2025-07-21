// lib/indexed-db.ts
import { openDB, type IDBPDatabase } from "idb"

const DB_NAME = "fitsair-survey-app"
const DB_VERSION = 1
const SURVEYS_STORE = "surveys"
const FLIGHT_NUMBERS_STORE = "flightNumbers"
const SURVEY_RECORDS_STORE = "surveyRecords"
const USER_PROFILE_STORE = "userProfile" // New store for user profile

let db: IDBPDatabase | null = null

async function getDb(): Promise<IDBPDatabase> {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(SURVEYS_STORE)) {
          db.createObjectStore(SURVEYS_STORE, { keyPath: "id", autoIncrement: true })
        }
        if (!db.objectStoreNames.contains(FLIGHT_NUMBERS_STORE)) {
          db.createObjectStore(FLIGHT_NUMBERS_STORE, { keyPath: "id", autoIncrement: true })
        }
        if (!db.objectStoreNames.contains(SURVEY_RECORDS_STORE)) {
          db.createObjectStore(SURVEY_RECORDS_STORE, { keyPath: "id", autoIncrement: true })
        }
        if (!db.objectStoreNames.contains(USER_PROFILE_STORE)) {
          // User profile will have a fixed key (e.g., 'current') as there's only one profile
          db.createObjectStore(USER_PROFILE_STORE)
        }
      },
    })
  }
  return db
}

// --- Survey Management ---
interface Survey {
  id?: number
  name: string
  url: string
}

export async function addSurvey(survey: Omit<Survey, "id">): Promise<number> {
  const db = await getDb()
  return db.add(SURVEYS_STORE, survey)
}

export async function getStoredSurveys(): Promise<Survey[]> {
  const db = await getDb()
  return db.getAll(SURVEYS_STORE)
}

export async function deleteSurvey(id: number): Promise<void> {
  const db = await getDb()
  await db.delete(SURVEYS_STORE, id)
}

// --- Flight Number Management ---
interface FlightNumber {
  id?: number
  number: string
}

export async function addFlightNumber(flight: Omit<FlightNumber, "id">): Promise<number> {
  const db = await getDb()
  return db.add(FLIGHT_NUMBERS_STORE, flight)
}

export async function getStoredFlightNumbers(): Promise<FlightNumber[]> {
  const db = await getDb()
  return db.getAll(FLIGHT_NUMBERS_STORE)
}

export async function deleteFlightNumber(id: number): Promise<void> {
  const db = await getDb()
  await db.delete(FLIGHT_NUMBERS_STORE, id)
}

// --- Survey Records (Offline Data) ---
export interface SurveyRecord {
  id?: number
  surveyName: string
  flightNumber: string
  timestamp: string // ISO string
  submitted: boolean // true if submitted to backend, false if pending
  surveyUrl: string
}

export async function addSurveyRecord(record: Omit<SurveyRecord, "id">): Promise<number> {
  const db = await getDb()
  return db.add(SURVEY_RECORDS_STORE, record)
}

export async function getSurveyRecords(): Promise<SurveyRecord[]> {
  const db = await getDb()
  return db.getAll(SURVEY_RECORDS_STORE)
}

export async function deleteSurveyRecord(id: number): Promise<void> {
  const db = await getDb()
  await db.delete(SURVEY_RECORDS_STORE, id)
}

export async function updateSurveyRecord(record: SurveyRecord): Promise<void> {
  const db = await getDb()
  await db.put(SURVEY_RECORDS_STORE, record)
}

// --- User Profile Management ---
export interface UserProfile {
  // Export interface for use in components
  name: string
  email: string
}

const PROFILE_KEY = "current" // Fixed key for the single user profile

export async function getUserProfile(): Promise<UserProfile | undefined> {
  const db = await getDb()
  return db.get(USER_PROFILE_STORE, PROFILE_KEY)
}

export async function updateUserProfile(profile: UserProfile): Promise<void> {
  const db = await getDb()
  await db.put(USER_PROFILE_STORE, profile, PROFILE_KEY)
}
