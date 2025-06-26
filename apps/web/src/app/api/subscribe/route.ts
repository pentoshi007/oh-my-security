import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the path to the subscribers file at the project root
const SUBSCRIBERS_FILE_PATH = path.join(process.cwd(), 'subscribers.csv');

// Basic email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE_PATH, 'utf-8');
    return data.split('\n').filter(Boolean); // Filter out empty lines
  } catch (error) {
    // If the file doesn't exist, it means no one has subscribed yet.
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 });
    }

    const lowercasedEmail = email.toLowerCase();
    const subscribers = await getSubscribers();

    if (subscribers.includes(lowercasedEmail)) {
      return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
    }

    // Append the new email with a newline character
    await fs.appendFile(SUBSCRIBERS_FILE_PATH, `${lowercasedEmail}\n`);

    return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ message: 'An internal error occurred. Please try again later.' }, { status: 500 });
  }
} 