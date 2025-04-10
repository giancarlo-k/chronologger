import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { route as authRoutes } from './authentication/routes.js'
import { route as logRoutes } from './logs/routes.js'
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config({ path: '../.env' });
const app = express();
const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

const allowedOrigins = ['https://soft-capybara-638585.netlify.app'];

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.originalUrl}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

// CORS Middleware with logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[${new Date().toISOString()}] CORS Check for origin: ${origin}`);

  if (allowedOrigins.includes(origin)) {
    console.log(`Origin allowed: ${origin}`);
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    console.log(`Origin denied: ${origin}`);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// CORS configuration
app.use(cors({
  origin: 'https://soft-capybara-638585.netlify.app',
  credentials: true
}));

// Handle OPTIONS pre-flight requests
app.options('*', cors({
  origin: 'https://soft-capybara-638585.netlify.app',
  credentials: true
}));

// Set up proxy
app.set('trust proxy', 1);

// Middleware for JSON and cookie parsing
app.use(express.json());
app.use(cookieParser());

// Log session information
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Session Info:`, req.session);
  next();
});

// Session middleware
app.use(session({
  secret: "no_idea_what_this_does_lol_27$$", 
  resave: false,            
  saveUninitialized: false,  
  cookie: {
    secure: true,            // send only over HTTPS
    sameSite: 'none'         // allow cross-origin requests
  }   
}));

// MongoDB connection
await mongoose.connect(`mongodb+srv://giancarlokite:${DB_PASSWORD}@mern-chronologger.iudfl.mongodb.net/?retryWrites=true&w=majority&appName=mern-chronologger`);

// Use authentication and logs routes
app.use('/users', authRoutes);
app.use('/logs', logRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const start = () => {
  app.listen(PORT, () => {
    console.log('App is running on port', PORT);
  });
};

start();
