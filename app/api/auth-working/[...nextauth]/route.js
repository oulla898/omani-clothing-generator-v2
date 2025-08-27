import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all Google sign-ins - no database restrictions
      console.log('Sign in attempt:', { email: user.email, provider: account.provider })
      return true
    },
    async jwt({ token, user, account }) {
      // Just store basic user info in JWT
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.credits = 10 // Default credits
      }
      return token
    },
    async session({ session, token }) {
      // Pass token data to session
      session.user.id = token.userId
      session.user.credits = token.credits
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: true
})

export { handler as GET, handler as POST }