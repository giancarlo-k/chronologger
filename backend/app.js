import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { route as authRoutes } from './authentication/routes.js'
import { route as logRoutes } from './logs/routes.js'
import cors from 'cors';
import cookieParser from "cookie-parser"

dotenv.config({ path: '../.env' });
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-heroku-app.herokuapp.com' : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(session({
  secret: "no_idea_what_this_does_lol_27$$", 
  resave: false,            
  saveUninitialized: false,  
  cookie: { secure: false }   
}));

await mongoose.connect(`mongodb+srv://giancarlokite:${DB_PASSWORD}@mern-chronologger.iudfl.mongodb.net/?retryWrites=true&w=majority&appName=mern-chronologger`);

app.use('/users', authRoutes);
app.use('/logs', logRoutes);

const start = () => {
  app.listen(PORT, () => {
    console.log('App is running on port', PORT);
  })
}

start();
