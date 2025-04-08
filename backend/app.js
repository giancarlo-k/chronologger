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
const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
app.use(cors({
  origin: 'https://67f59e05fe029187a44ef661--soft-capybara-638585.netlify.app',
  credentials: true
}));


app.set('trust proxy', 1);

app.use(express.json());
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
