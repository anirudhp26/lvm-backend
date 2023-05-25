import express from 'express';
import { login, getUsers } from '../controllers/auth.js';

const router = express.Router();

router.post("/login", login);
router.post("/getUsers", getUsers);

export default router;