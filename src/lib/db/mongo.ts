import { MongoClient, type Db } from 'mongodb';
import { MONGODB_URI, MONGODB_DB } from '../config/env';

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(MONGODB_URI!);
    await client.connect();
  }

  db = client.db(MONGODB_DB);
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
  }
}
