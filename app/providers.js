'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }) {
  return (
    <SessionProvider basePath="/api/auth-working">
      {children}
    </SessionProvider>
  )
}