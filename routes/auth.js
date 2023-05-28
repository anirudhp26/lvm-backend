import express from 'express';
import { login, getUsers, signup } from '../controllers/auth.js';

const router = express.Router();

router.post("/login", login);
router.post("/getUsers", getUsers);
router.post("/signup", signup)
export default router;