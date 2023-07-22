import express from 'express';
import { getblogbyid, getblogsbykeywords, getblogsbyuser, saveBlog } from '../controllers/blogs.js';

const router = express.Router();

router.post('/getBlogbyID', getblogbyid);
router.post('/getBlogbyUser', getblogsbyuser);
router.post('/getBlogbyKeywords', getblogsbykeywords);
router.post('/saveblog', saveBlog);
export default router