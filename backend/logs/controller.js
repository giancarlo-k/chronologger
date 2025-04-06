import { Log } from "./model.js"; 
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const randomImagename = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION
})

export const createLog = async (req, res) => {
  try {
    const { title, goal, image, createdAtFormatted, loggedTime  } = req.body;
  
    const username = req.session.user.username;

    const lowercaseTitle = title.toLowerCase()

    const imageKey = randomImagename();

    // send iamge to aws s3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params);

    await s3.send(command);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

  
    const newLog = new Log({
      title,
      lowercaseTitle,
      goal,
      image: imageUrl,
      createdAt: new Date(),
      createdAtFormatted,
      username, 
      loggedTime
    });
  
    await newLog.save();
  
    res.status(200).json({
      message: 'Log created and added to database successfully!',
      log: newLog
    });

  } catch (error) {
    console.log(error)
  }
}

export const loadLogs = async (req, res) => {
  const username = req.session.user.username;

  const logs = await Log.find({ username })

  return res.status(200).json({ logs });
}

export const loadLogInfo = async (req, res) => {
  const logID = req.params.logID;
  const log = await Log.findOne({ _id: logID })

  if (!log) {
    return res.status(404).json({ message: 'Log not found' });
  }

  return res.status(200).json({ log })
}

export const deleteAllLogs = async (req, res) => {
  try {
    await Log.deleteMany({});

    return res.status(200).json({ message: 'All logs deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

export const deleteLog = async (req, res) => {
  const logID = req.params.logID;
  const log = await Log.deleteOne({ _id: logID })

  if (!log) {
    return res.status(404).json({ message: 'Log not found' })
  }

  return res.status(200).json({ log });
}

export const editLog = async (req, res) => {
  try {
    const { title, goal, image, logID } = req.body;

    // Find the log by ID
    const log = await Log.findById(logID);

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    const currentImageUrl = log.image;
  
    const username = req.session.user.username;
    const lowercaseTitle = title.toLowerCase();

    if (req.file) {
      const currentImageKey = currentImageUrl.split('/').pop();

      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: currentImageKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams)); 

      const newImageKey = randomImagename();
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newImageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const uploadCommand = new PutObjectCommand(uploadParams);
      await s3.send(uploadCommand);

      const newImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newImageKey}`;

      log.image = newImageUrl;
    }

    log.title = title;
    log.lowercaseTitle = lowercaseTitle;
    log.goal = goal;
    await log.save();

    res.status(200).json({
      message: 'Log updated successfully!',
      log,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating log' });
  }
};

export const addLoggedTime = async (req, res) => {
  try {
    const { formattedLoggedTime, formattedDate, loggedTimeTotal, logID } = req.body;

    const updatedLog = await Log.findOneAndUpdate(
      { _id: logID },
      {
        $push: { loggedTimes: { formattedDate, formattedLoggedTime, loggedTimeTotal } },
        $inc: { loggedTime: loggedTimeTotal }
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Log updated successfully!',
      log: updatedLog
    })
  } catch (error) {
    console.log(error)
  }
}

export const uploadPhoto = async (req, res) => {
  try {

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomImagename(),
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params);

    await s3.send(command)
    res.json({ success: true })

  } catch (error) {
    console.log(error)
  }
}