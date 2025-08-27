import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })
    }

    // Get all users with their generation count
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { generations: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
  }
}