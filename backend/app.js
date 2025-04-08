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
  origin: true,
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from your local server
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow these HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow content-type header
  next(); // Pass to the next middleware or route
});

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
