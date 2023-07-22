import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogs = new Schema(
    {
        title: { type: String, required: true, },
        user: { type: String, required: true },
        impressed: { type: Number, required: true },
        content: { type: String, required: true },
        keywords: { type: Array, required: true },
        views: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

const Blog = mongoose.model('blogs', blogs);
export default Blog;