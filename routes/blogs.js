import express from 'express';
import { addComment, deleteBlog, getblogbyid, getblogsbykeywords, getblogsbyuser, recommendation, updateBlog } from '../controllers/blogs.js';

const router = express.Router();

router.post('/getBlogbyID', getblogbyid);
router.post('/getBlogbyUser', getblogsbyuser);
router.post('/getBlogbyKeywords', getblogsbykeywords);
router.post('/getRecommendations', recommendation);
router.post('/updateBlog', updateBlog);
router.post('/deleteBlog', deleteBlog);
router.post('/addcomment', addComment);
export default router;