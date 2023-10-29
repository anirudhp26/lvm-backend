import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comments from "../models/Comments.js";

export const getblogsbyuser = async (req, res) => {
    const username = req.body.user;
    const user = await User.find({ username: username });
    if (user.length !== 0) {
        user[0].password = undefined;
        Blog.find({ user: user[0]._id }, (err, responce) => {
            if (err) {
                res.status(201).json({ message: 'Some Error occured, Please try after sometime' });
            } else {
                res.status(200).json({ blogs: responce, user: user });
            }
        })
    } else {
        res.status(201).json({ message: 'Some Error occured, Please try after sometime' });
    }
}

export const getblogsbykeywords = (req, res) => {
    const search = req.body.search;
    const sArray = search.match(/\b(\w+)\b/g);
}

export const getblogbyid = async (req, res) => {
    const id = req.body.blogId;
    var blog = await Blog.findOne({ _id: id });

    try {
        var views = blog.views;
        views++;
        blog.views = views;
        blog = await Blog.findByIdAndUpdate(id, { views: views });
        const userid = blog.user;
        var user = await User.findOne({ _id: userid });
        delete user.password;
        const comments = await Comments.find({ blog_id: id })
            .populate({
                path: 'author_id',
                model: User,
                select: 'username picture'
            })
            .populate({
                path: 'replies.author_id',
                model: User,
                select: 'username picture',
            });
        if (blog) {
            res.status(200).json({ blog: blog, user: user, comments: comments });
        } else {
            res.status(401).json({ message: "Some Error has occured please try again later!" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Some Error has occured please try again later!" });
    }
}

export const saveBlog = async (req, res) => {
    const title = req.body.title;
    const tArray = req.body.keywords;
    const content = req.body.content;
    const writer = req.body.writer;
    const coverPath = req.body.coverImgPath;
    const blog = new Blog({ title: title, content: content, user: writer, keywords: tArray, impressed: [], views: 0, coverPath: coverPath });
    const responce = await blog.save();
    if (responce) {
        res.status(200).json({ blog: responce });
    } else {
        res.status(201).json({ message: 'Some error occured! Please try again after sometime...' });
    }
}

export const trending = async (req, res) => {
    try {
        const id = req.body.id;
        const gotimpressedbyBlogs = await Blog.find().populate({
            path: 'user',
            model: User,
            select: 'username picture'
        }).sort({ views: -1 }).limit(10);
        gotimpressedbyBlogs.sort((a, b) => b.createdAt - a.createdAt);
        const friends = await User.find({ impressed: { $in: [id] } });
        res.status(200).json({ blogs: gotimpressedbyBlogs, friends: friends });
    } catch (error) {
        console.log(error);
    }
}

export const personalized = async (req, res) => {
    try {
        const id = req.body.id;
        let gotimpressedbyBlogs = [];
        const friends = await User.find({ impressed: { $in: [id] } });
        await Promise.all(friends.map(async (friend) => {
            const blogs = await Blog.find({ user: friend._id }).populate({
                path: 'user',
                model: User,
                select: 'username picture'
            });
            gotimpressedbyBlogs.push(...blogs);
        }));
        res.status(200).json({ blogs: gotimpressedbyBlogs });
        
    } catch (error) {
        console.log(error);
    }
}

export const updateBlog = async (req, res) => {
    const updated_blog = req.body.blog;
    delete updated_blog.__v;
    const blog = await Blog.findOne({ _id: updated_blog._id });
    Object.assign(blog, updated_blog);
    const save_blog = await blog.save();
    res.status(200).json({ status: 'ok', updated_blog: save_blog });
}

export const deleteBlog = async (req,res) => {
    const id = req.body.id;
    const responce = await Blog.deleteOne({ _id: id });
    if (responce) {
        res.status(200).json({ status: "OK" });
    } else {
        res.status(400).json({ status: "Error" });
    }
}

export const addComment = async (req, res) => {
    const blogId = req.body.blogId;
    const userId = req.body.userId;
    const content = req.body.content;
    const comment = new Comments({ author_id: userId, blog_id: blogId, content: content, impressed: 0 });
    const responce = await comment.save();
    const comments = await Comments.find({ blogId: req.params.blogId }).populate('replies.author_id').populate('author_id');
    if (responce) {
        res.status(200).json({ comments: comments });
    }
}