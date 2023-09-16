import mongoose from "mongoose";
const Schema = mongoose.Schema;

const comments = new Schema(
    {
        author_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
        blog_id: { type: String, required: true },
        datetime: { type: Date, default: Date.now },
        impressed: { type: Number },
        content: { type: String, required: true },
        replies: [
            {
                author_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
                datetime: { type: Date, default: Date.now },
                content: { type: String, required: true },
            }
        ],
    },
    {
        timestamps: true,
    },
);

const Comments = mongoose.model('comments', comments);
export default Comments;