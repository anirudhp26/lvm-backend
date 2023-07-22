import express from 'express';
import { getblogbyid, getblogsbykeywords, getblogsbyuser, saveBlog } from '../controllers/blogs';

const blogRoutes = express.Router();

blogRoutes.post('/getBlogbyID', getblogbyid);
blogRoutes.post('/getBlogbyUser', getblogsbyuser);
blogRoutes.post('/getBlogbyKeywords', getblogsbykeywords);
blogRoutes.post('/saveblog', saveBlog);
export default blogRoutes;