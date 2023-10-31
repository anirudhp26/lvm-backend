import express from 'express';
import { addComment, deleteBlog, getblogbyid, getblogsbykeywords, getblogsbyuser, personalized, trending, updateBlog } from '../controllers/blogs.js';

const router = express.Router();

router.post('/getBlogbyID', getblogbyid);
router.post('/getBlogbyUser', getblogsbyuser);
router.post('/getBlogbyKeywords', getblogsbykeywords);
router.post('/saveblog', saveBlog);
router.post('/getTrending', trending);
router.post('/getPersonalized', personalized);
router.post('/updateBlog', updateBlog);
router.post('/deleteBlog', deleteBlog);
router.post('/addcomment', addComment);
export default router;