# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with:

```
# Replicate API
REPLICATE_API_TOKEN=your-replicate-api-token-here

# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note:** Replace with your actual tokens and secrets.

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to `.env.local`

### 2. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 3. Start the application
```bash
npm run dev
```

## Model Information

- **Model ID**: `oulla898/omani:16fe80f481f289b423395181cb81f78a3e88018962e689157dcfeba15f149e2a`
- **Trigger Word**: `omani` (automatically added to all prompts)
- **Specialization**: Traditional Omani men's clothing and ceremonial attire

## Features

- ✅ Google Authentication
- ✅ 10 free credits for new users
- ✅ Credit system (1 credit per image)
- ✅ User dashboard with balance
- ✅ Secure image generation