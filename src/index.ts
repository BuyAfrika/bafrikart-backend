import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import waitlistRoutes from "./routes/waitlistRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [
  "https://bafrikart-waitlist.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.options("/", cors());
app.options("/api/waitlist", cors());

app.use(express.json());
app.use("/api/waitlist", waitlistRoutes);

let isConnected = false;

const connectToDb = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

//connect db before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bafrikart Server is Running!");
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    await connectToDb();
    console.log(`Server running on ${PORT}`);
  });
}
