import mongoose from 'mongoose';


const WaitlistSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Please provide a full name'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
      'Please add a valid email'
    ], 
    trim: true,
    lowercase: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  userType: { 
    type: String, 
    enum: ['fashion_influencer', 'shoe_lover', 'artisan'],
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Waitlist = mongoose.model('Waitlist', WaitlistSchema);
export default Waitlist;