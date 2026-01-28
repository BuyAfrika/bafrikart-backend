import { Request, Response } from "express";
import Waitlist from "../models/Waitlist";
import { addContactToPulse } from "../services/sendpulse";

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const { fullName, email, location, userType } = req.body;
    // Create the new entry
    const newEntry = await Waitlist.create({
      fullName,
      email,
      location,
      userType,
    });
    // Add to SendPulse
    addContactToPulse(email, fullName, location, userType);

    // Send success response
    res.status(201).json({
      success: true,
      message:
        "Congratulation, you're in! You have successfully joined the waitlist!",
      data: newEntry,
    });
  } catch (error) {
    const err = error as any;

    // duplicate key error
    if (err?.code === 11000) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // mongoose validation
    if (err?.name === "ValidationError") {
      res.status(400).json({ message: err.message });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
