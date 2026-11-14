import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB?.trim() || "verdant_path";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export const isMongoConfigured = (): boolean => {
  return Boolean(uri && uri.length > 5 && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
};

if (isMongoConfigured()) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri!);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri!);
    clientPromise = client.connect();
  }
}

/**
 * Returns connected MongoDB native Database instance.
 */
export async function getDb(): Promise<Db> {
  if (!isMongoConfigured() || !clientPromise) {
    throw new Error(
      "MongoDB is not configured yet. Please provide your MONGODB_URI in .env.local"
    );
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

import { DEFAULT_GALLERY_IMAGES, GalleryItem } from "./constants";

export { DEFAULT_GALLERY_IMAGES, type GalleryItem };

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  city?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VisitorRecord {
  _id?: string;
  ipHash?: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface EnquiryRecord {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  enquiryFor: string;
  message?: string;
  createdAt: Date;
}

// In-Memory Fallback Store (Ensures everything runs smoothly before MongoDB credentials are added)
export const memoryStore = {
  users: [
    {
      _id: "usr_admin_1",
      name: "Verdant Administrator",
      email: "admin@verdantpath.com",
      passwordHash: "$2a$10$wT8Kz54J6q87J9R3fD4qce1Wz9L5K4c9d7J3f8R6q1Wz9L5K4c9d7", // "admin123"
      role: "admin" as const,
      createdAt: new Date(),
    },
  ] as UserRecord[],
  visitors: [] as VisitorRecord[],
  gallery: [...DEFAULT_GALLERY_IMAGES] as GalleryItem[],
  enquiries: [] as EnquiryRecord[],
};
