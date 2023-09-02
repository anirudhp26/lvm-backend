import express from 'express';
import { getblogbyid, getblogsbykeywords, getblogsbyuser } from '../controllers/blogs.js';

const router = express.Router();

router.post('/getBlogbyID', getblogbyid);
router.post('/getBlogbyUser', getblogsbyuser);
router.post('/getBlogbyKeywords', getblogsbykeywords);
export default router