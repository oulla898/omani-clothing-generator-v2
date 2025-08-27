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
  session: {
    strategy: 'jwt', // Use JWT instead of database sessions
  },
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
    async jwt({ token, user, account }) {
      // Persist user info in JWT token
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          if (dbUser) {
            token.userId = dbUser.id
            token.credits = dbUser.credits
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.userId
        session.user.credits = token.credits
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }