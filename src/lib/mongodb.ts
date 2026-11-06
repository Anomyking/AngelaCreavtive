import { MongoClient, Db } from "mongodb";

// The connection string is read lazily (inside getDb) rather than at import
// time: `next build` imports every route file, and a module-level throw would
// fail the build on any machine that doesn't have the secret set.

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoIndexesPromise?: Promise<void>;
};

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI env var is not set. Add your MongoDB connection string to .env.local (and to your host's environment variables).");
  }

  // Cache the client on globalThis so dev hot-reloads and serverless warm
  // invocations reuse one connection pool instead of opening a new one per request.
  if (!globalForMongo._mongoClientPromise) {
    const promise = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
    // If the first attempt fails, forget it so the next request retries
    promise.catch(() => { globalForMongo._mongoClientPromise = undefined; });
    globalForMongo._mongoClientPromise = promise;
  }
  return globalForMongo._mongoClientPromise;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("orders").createIndex({ reference: 1 }, { unique: true }),
    db.collection("orders").createIndex({ created_at: -1 }),
    db.collection("orders").createIndex({ status: 1 }),
    db.collection("quotes").createIndex({ created_at: -1 }),
    db.collection("quotes").createIndex({ status: 1 }),
    db.collection("product_status").createIndex({ product_id: 1 }, { unique: true }),
  ]);
}

/** Returns the app database (default name "angela", override with MONGODB_DB). */
export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB || "angela");

  // Create indexes once per server process; never let an index problem break a request.
  if (!globalForMongo._mongoIndexesPromise) {
    globalForMongo._mongoIndexesPromise = ensureIndexes(db).catch((err) => {
      console.error("MongoDB index setup failed:", err);
      globalForMongo._mongoIndexesPromise = undefined;
    });
  }
  await globalForMongo._mongoIndexesPromise;
  return db;
}
