import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const getblogsbyuser = async (req, res) => {
    const username = req.body.user;
    const user = await User.find({ username: username });
    if(user.length !== 0){
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
        if (blog) {
            res.status(200).json({ blog: blog, user: user });
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
    const coverPath = req.body.coverPath;
    const blog = new Blog({ title: title, content: content, user: writer, keywords: tArray, impressed: 0, views: 0, coverPath: coverPath });
    const responce = await blog.save();
    if (responce) {
        res.status(200).json({ blog: responce });
    } else {
        res.status(201).json({ message: 'Some error occured! Please try again after sometime...' });
    }
}

export const recommendation = async (req,res) => {
    try {
        const id = req.body.id;
        let gotimpressedbyBlogs = [];
        const friends = await User.find({ impressed: { $in: [id] } });
    
        await Promise.all(friends.map(async (friend) => {
            const blogs = await Blog.find({ user: friend._id });
            console.log(blogs.length);
            gotimpressedbyBlogs.push(...blogs);
        }));
    
        console.log("sahbd");
        res.status(200).json({ blogs: gotimpressedbyBlogs });
    } catch (error) {
        console.log(error);
    }
    
}