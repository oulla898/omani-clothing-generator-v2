import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        // If user doesn't exist, create them with 10 free credits
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              credits: 10
            }
          })
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        // Get user's current credit balance
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, credits: true }
        })
        
        if (user) {
          session.user.id = user.id
          session.user.credits = user.credits
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }