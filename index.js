import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import { roomRoute } from "./routes/rooms.js";
import { bookingRoute } from "./routes/booking.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

const PORT = process.env.PORT;

async function createConnection() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongo connected");
    return client;
  } catch (error) {
    console.log(`Error is ${error}`);
  }
}

export const client = await createConnection();

app.get("/", async (req, res) => {
  res.status(200).send("<h1>WELCOME TO HALLBOOKING APP</h1>");
});

app.use("/rooms", roomRoute);

app.use("/", bookingRoute);

app.listen(PORT, () => console.log(`port is ${PORT}`));
