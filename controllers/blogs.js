import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const getblogsbyuser = (req,res) => {
    const user = req.body.username;
    Blog.find({user: user}, (err, responce) => {
        if (err) {
            res.status(201).json({message: 'Some Error occured, Please try after sometime'});
        } else {
            res.status(200).json({blogs: responce});    
        }
    })
}

export const getblogsbykeywords = (req,res) => {
    const search = req.body.search;
    const sArray = search.match(/\b(\w+)\b/g);
}

export const getblogbyid = async (req,res) => {
    const id = req.body.id;
    var blog = await Blog.findOne({ _id: id }, async (err, response) => {
        if (err) {
            res.status(401).json({ message: "Some Error has occured please try again later!"});
        } else {
            const views = blog.views;
            views++;
            blog.views = views;
            blog = await Blog.findByIdAndUpdate(id, { views: views });
        }
    });
    const userid = blog.user;
    var  user = await User.findOne({ _id: userid });
    delete user.password;
    if (blog) {
        res.status(200).json({ blog: blog,  user: user });
    } else {
        res.status(401).json({ message: "Some Error has occured please try again later!"});
    }
}

export const saveBlog = async (req,res) => {
    const title = req.body.title;
    // const tArray = title.match(/\b(\w+)\b/g);
    const tArray = [];
    const content = req.body.content;
    const writer = req.body.writer;
    const blog = new Blog({title: title, content: content, user: writer, keywords: tArray, impressed: 0, views: 0});
    const responce = await blog.save();
    if (responce) {
        res.status(200).json({blog: responce});
    } else {
        res.status(201).json({message: 'Some error occured! Please try again after sometime...'});
    }
}