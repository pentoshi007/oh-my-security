import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { createSubscriber, type Subscriber } from '@/models/Subscriber';

// Temporary file-based fallback until MongoDB is installed
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE_PATH = path.join(process.cwd(), 'subscribers.csv');
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// MongoDB implementation
async function addSubscriberToMongoDB(email: string) {
  try {
    const subscribersCollection = await getCollection('subscribers');
    
    // Check if email already exists
    const existingSubscriber = await subscribersCollection.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingSubscriber) {
      return { success: false, message: 'This email is already subscribed.', status: 409 };
    }
    
    // Create new subscriber
    const newSubscriber = createSubscriber(email);
    const result = await subscribersCollection.insertOne(newSubscriber);
    
    if (result.insertedId) {
      return { success: true, message: 'Thank you for subscribing!', status: 201 };
    } else {
      return { success: false, message: 'Failed to subscribe. Please try again.', status: 500 };
    }
  } catch (error) {
    console.error('MongoDB subscription error:', error);
    return { success: false, message: 'An internal error occurred. Please try again later.', status: 500 };
  }
}

// Fallback file-based implementation
async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE_PATH, 'utf-8');
    return data.split('\n').filter(Boolean);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function addSubscriberToFile(email: string) {
  try {
    const lowercasedEmail = email.toLowerCase();
    const subscribers = await getSubscribers();

    if (subscribers.includes(lowercasedEmail)) {
      return { success: false, message: 'This email is already subscribed.', status: 409 };
    }

    await fs.appendFile(SUBSCRIBERS_FILE_PATH, `${lowercasedEmail}\n`);
    return { success: true, message: 'Thank you for subscribing!', status: 201 };
  } catch (error) {
    console.error('File subscription error:', error);
    return { success: false, message: 'An internal error occurred. Please try again later.', status: 500 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 });
    }

    // Try MongoDB first, fallback to file if not configured
    let result;
    try {
      result = await addSubscriberToMongoDB(email);
    } catch (mongoError) {
      console.warn('MongoDB not available, falling back to file storage:', mongoError instanceof Error ? mongoError.message : 'Unknown error');
      result = await addSubscriberToFile(email);
    }

    return NextResponse.json({ message: result.message }, { status: result.status });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ message: 'An internal error occurred. Please try again later.' }, { status: 500 });
  }
} 