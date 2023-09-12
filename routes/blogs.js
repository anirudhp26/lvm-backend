import express from 'express';
import { getblogbyid, getblogsbykeywords, getblogsbyuser, recommendation, updateBlog } from '../controllers/blogs.js';

const router = express.Router();

router.post('/getBlogbyID', getblogbyid);
router.post('/getBlogbyUser', getblogsbyuser);
router.post('/getBlogbyKeywords', getblogsbykeywords);
router.post('/getRecommendations', recommendation);
router.post('/updateBlog', updateBlog);
export default router