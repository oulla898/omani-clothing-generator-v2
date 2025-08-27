import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Simple signIn callback:', { user: user?.email, account: account?.provider })
      return true
    },
    async session({ session, token }) {
      console.log('Simple session callback:', { email: session?.user?.email })
      return session
    }
  }
})

export { handler as GET, handler as POST }