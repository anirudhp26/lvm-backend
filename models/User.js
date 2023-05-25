import mongoose from "mongoose";
const Schema = mongoose.Schema;

const users = new Schema(
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

const User = mongoose.model('users', users);
export default User;