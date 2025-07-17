// MongoDB connection utility
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'oh-my-security';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI environment variable not set. MongoDB features will be disabled.');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
} else {
  // Create a rejected promise if no URI is provided
  clientPromise = Promise.reject(new Error('MongoDB URI not configured'));
}

export async function getDb(): Promise<Db> {
  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not configured. Please set MONGODB_URI environment variable.');
  }
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCollection(collectionName: string) {
  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not configured. Please set MONGODB_URI environment variable.');
  }
  const db = await getDb();
  return db.collection(collectionName);
}

export default clientPromise; 