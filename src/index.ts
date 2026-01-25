import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import waitlistRoutes from './routes/waitlistRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());              
app.use(express.json());     

app.use('/api/waitlist', waitlistRoutes);

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

//  Test if server is working
app.get('/', (req: Request, res: Response) => {
  res.send('Bafrikart Server is Running!');
});


app.listen(PORT, () => {
  connectToDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});