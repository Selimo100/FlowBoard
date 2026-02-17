
let uri: string | undefined;
let dbName: string | undefined;

// @ts-ignore
if (typeof import.meta !== 'undefined' && import.meta.env) {
  // @ts-ignore
  uri = import.meta.env.MONGODB_URI;
  // @ts-ignore
  dbName = import.meta.env.MONGODB_DB;
}

if (!uri && typeof process !== 'undefined' && process.env) {
  uri = process.env.MONGODB_URI;
  dbName = process.env.MONGODB_DB;
}

export const MONGODB_URI = uri;
export const MONGODB_DB = dbName;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!MONGODB_DB) {
  console.error("MONGODB_DB is not defined in environment variables");
  throw new Error("MONGODB_DB is not defined in environment variables");
}
