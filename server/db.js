import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDb() {
  await client.connect();
  return client.db("pomodoro");
}
