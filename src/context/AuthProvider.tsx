"use client"

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
} : {childern: React.ReactNode}) {
  return (
    <SessionProvider >
      { children }
    </SessionProvider>
  )
}