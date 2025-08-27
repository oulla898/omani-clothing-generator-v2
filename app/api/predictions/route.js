import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '../../generated/prisma';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const prisma = new PrismaClient();

// Prevent Next.js / Vercel from caching responses
// See https://github.com/replicate/replicate-javascript/issues/136#issuecomment-1728053102
replicate.fetch = (url, options) => {
  return fetch(url, { ...options, cache: "no-store" });
};

// In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
// In development (on your local machine), the NGROK_HOST environment variable is set.
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
    );
  }

  const { prompt, userId } = await request.json();

  // Get user session
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ detail: 'Authentication required' }, { status: 401 });
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ detail: 'User not found' }, { status: 404 });
  }

  // Check if user has credits
  if (user.credits <= 0) {
    return NextResponse.json({ detail: 'Insufficient credits' }, { status: 402 });
  }

  const options = {
    version: '16fe80f481f289b423395181cb81f78a3e88018962e689157dcfeba15f149e2a',
    input: { 
      prompt: `omani, ${prompt}`,  // Always prepend the trigger word
      model: "dev",
      lora_scale: 1,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      guidance_scale: 3,
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps: 28
    }
  }

  if (WEBHOOK_HOST) {
    options.webhook = `${WEBHOOK_HOST}/api/webhooks`
    options.webhook_events_filter = ["start", "completed"]
  }

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  // Deduct 1 credit from user and save generation
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } }
    }),
    prisma.generation.create({
      data: {
        userId: user.id,
        prompt: prompt,
        status: 'processing'
      }
    })
  ]);

  return NextResponse.json(prediction, { status: 201 });
}