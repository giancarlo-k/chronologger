import {Router} from 'express';
import { createLog, loadLogs, deleteAllLogs, loadLogInfo, deleteLog, editLog, addLoggedTime, uploadPhoto } from './controller.js';
export const route = new Router();
import { upload } from './controller.js';  // Import the multer upload setup

route.post('/', upload.single('image'), createLog);
route.get('/', loadLogs);
route.delete('/', deleteAllLogs);
route.get('/:logID', loadLogInfo);
route.delete('/:logID', deleteLog);
route.put('/:logID', upload.single('image'), editLog);
route.post('/:logID/times', addLoggedTime);
route.post('/uploadtos3', upload.single('image'), uploadPhoto)