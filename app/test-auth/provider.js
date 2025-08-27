'use client'

import { SessionProvider } from 'next-auth/react'

export function WorkingAuthProvider({ children }) {
  return (
    <SessionProvider 
      basePath="/api/auth-working"
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}