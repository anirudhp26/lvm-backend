import mongoose from "mongoose";
const Schema = mongoose.Schema;

const users = new Schema(
    {
        googleId: {type: String, trim: true},
        username: {type: String, required: true, trim: true,},
        name: {type: String, required: true,},
        email: {type: String, required: false, trim: true,},
        bio: {type: String, required: true,},
        picture: {type: String, required: false,},
        impressed: {type: Array},
        password: {type: String, required: true,trim: true,},
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('users', users);
export default User;