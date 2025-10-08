import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;
console.log('--------',MONGODB_URI)
// if (!MONGODB_URI) {
//   throw new Error("Please define MONGODB_URI in .env.local");
// }

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
    console.log(MONGODB_URI)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect('mongodb+srv://supriyajha3737_db_user:1PS5QiYLrecRTAsy@cluster0.0jn2adb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;