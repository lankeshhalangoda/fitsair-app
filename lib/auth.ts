// lib/auth.ts
export function authenticate(email: string, password: string): boolean {
  const MOCK_EMAIL = "user@fitsair.com"
  const MOCK_PASSWORD = "password123"

  return email === MOCK_EMAIL && password === MOCK_PASSWORD
}
