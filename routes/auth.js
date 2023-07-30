import express from 'express';
import { login, getUsers, signup, updateUser } from '../controllers/auth.js';

const router = express.Router();

router.post("/login", login);
router.post("/getUsers", getUsers);
router.post("/signup", signup);
router.post("/updateUser", updateUser);
export default router;