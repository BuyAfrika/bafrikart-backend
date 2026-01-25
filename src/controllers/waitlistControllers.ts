import { Request, Response } from 'express';
import Waitlist from '../models/Waitlist';

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const { fullName, email, location, userType } = req.body;
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
       return res.status(409).json({ message: 'User already exists' });
    }

    const newEntry = await Waitlist.create({
      fullName,
      email,
      location,
      userType
    });

    res.status(201).json({ 
      message: "Congratulation, you're in! You have successfully joined the waitlist! You'll be the first to know when we launch.", 
      data: newEntry 
    });

  } catch (error: any) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};