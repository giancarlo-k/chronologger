import {Router} from 'express';
import { addUser, deleteUser, deleteAllUsers, authenticateUser, isAuthenticated, logout } from './controller.js';
export const route = new Router();

route.post('/add', addUser);
route.delete('/delete/:id', deleteUser);
route.post('/login', authenticateUser);
route.get('/auth/status', isAuthenticated);
route.get('/logout', logout);
// route.delete('/deleteall', deleteAllUsers);