import { NextResponse } from 'next/server';
import { generateAndSaveContent } from '@oms/generator/src/contentGenerator.js';
import ora from 'ora';

// This is a mock Ora instance that does nothing in the serverless environment.
const mockSpinner = {
  start: () => mockSpinner,
  succeed: () => mockSpinner,
  fail: () => mockSpinner,
} as any;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');

  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('Cron job started: Generating daily content...');
    await generateAndSaveContent(mockSpinner);
    console.log('Cron job finished successfully.');
    return NextResponse.json({ success: true, message: 'Content generated successfully.' });
  } catch (error) {
    console.error('Cron job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 