import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    // Get user session
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })
    }

    const { userId, credits } = await request.json()

    // Validate input
    if (!userId || credits < 0 || isNaN(credits)) {
      return NextResponse.json({ detail: 'Invalid input' }, { status: 400 })
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: parseInt(credits) }
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `Credits updated to ${credits} for user ${updatedUser.email}` 
    })
  } catch (error) {
    console.error('Error updating credits:', error)
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
  }
}