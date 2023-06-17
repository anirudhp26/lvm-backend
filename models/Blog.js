import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogs = new Schema(
    {
        username: {type: String, required: true, trim: true,},
        name: {type: String, required: true,},
        bio: {type: String, required: true,},
        impressed: {type: Array},
        password: {type: String, required: true,trim: true,},
    },
    {
        timestamps: true,
    },
);

const Blog = mongoose.model('blogs', blogs);
export default Blog;