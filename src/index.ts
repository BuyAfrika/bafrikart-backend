import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import waitlistRoutes from "./routes/waitlistRoutes";

dotenv.config();

const app: Express = express();

const allowedOrigins = [
  "https://bafrikart-waitlist.vercel.app",
  "http://localhost:3000",
];

// ✅ CORS MUST come before everything
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (server-to-server, Vercel health checks, etc.)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ Always respond to preflight (TypeScript-safe)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ---- DB connection (before routes) ----
let isConnected = false;

const connectToDb = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

// ✅ Ensure DB is connected before handling requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDb();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Bafrikart Server is Running!");
});

app.use("/api/waitlist", waitlistRoutes);

export default app;

// Local dev only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}
