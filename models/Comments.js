import mongoose from "mongoose";
const Schema = mongoose.Schema;

const comments = new Schema(
    {
        author_id: { type: String, required: true, },
        datetime: { type: Date, default: Date.now },
        replies: [
            {
                author_id: { type: String, required: true, },
                datetime: { type: Date, default: Date.now },
            }
        ],
    },
    {
        timestamps: true,
    },
);

const Comments = mongoose.model('comments', comments);
export default Comments;