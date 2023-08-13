import express from 'express';
import { login, getUsers, signup, updateUser } from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/login", login);
router.post("/getUsers", verifyToken, getUsers);
router.post("/signup", signup);
router.post("/updateUser", verifyToken, updateUser);
export default router;