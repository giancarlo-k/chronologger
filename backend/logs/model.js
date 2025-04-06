import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lowercaseTitle: { type: String, required: true },
  goal: { type: Number, required: true },
  image: { type: String, required: true } ,
  createdAt: { type: String, required: true },
  createdAtFormatted: { type: String, required: true },
  username: { type: String, required: true },
  loggedTimes: [{
    formattedDate:  { type: String, required: true },
    formattedLoggedTime: { type: String, required: true },
    loggedTimeTotal: { type: Number, required: true }
  }],
  loggedTime: { type: Number, required: true }
})

export const Log = mongoose.model('Log', logSchema);