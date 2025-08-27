import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic functionality
    const envVars = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET
    }

    return NextResponse.json({ 
      status: 'ok',
      message: 'API is working',
      env: envVars
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, { status: 500 })
  }
}