import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import waitlistRoutes from "./routes/waitlistRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["https://bafrikart-waitlist.vercel.app", "http://localhost:3000"],
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", cors());
app.use(express.json());

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

app.use("/api/waitlist", waitlistRoutes);

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
