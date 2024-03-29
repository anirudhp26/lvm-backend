import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const salt = 1;

export const login = async (req, res) => {
    const isGoogleLogin = req.body.googlelogin;
    if (isGoogleLogin) {
        const googleId = req.body.googleId;
        User.find({ googleId: googleId }, (err, responce) => {
            if (responce.length === 0) {
                const token = jwt.sign({ id: googleId }, process.env.JWT_SECRET);
                res.status(201).json({ message: "You'll be redirected to edit profile page where you can add a username to your account", token });
            } else {
                const token = jwt.sign({ id: responce[0]._id }, process.env.JWT_SECRET);
                res.status(200).json({ user: responce[0], loginStatus: true, token });
            }
        });
    } else {
        const regusername = req.body.username;
        const regpassword = req.body.password;
        User.find({ username: regusername }, (err, responce) => {
            if (err != undefined) {
                res.status(200).json({ loginStatus: false, message: 'Some Error encountered, Please try again after sometime' })
            }
            if (responce.length == 0) {
                res.status(200).json({ loginStatus: false, message: 'No such User exists' })
            } else {
                bcrypt.compare(regpassword, responce[0].password, (error, valid) => {
                    if (error) {
                        res.status(200).json({ loginStatus: false, message: 'Some Error encountered, Please try again after sometime' })
                    }
                    if (valid) {
                        const token = jwt.sign({ id: responce[0]._id }, process.env.JWT_SECRET);
                        responce[0].password = undefined;
                        res.status(200).json({ user: responce[0], loginStatus: true, token });
                    } else {
                        res.status(201).json({ loginStatus: false, message: 'Incorrect Password' })
                    }
                });
            };
        });
    }
};

export const checkUser = async (req, res) => {
    const username = req.body.username;
    const responce = await User.find({ username: username });
    if (responce.length > 0) {
        res.status(201).json({ username_available: false });
    } else {
        res.status(200).json({ username_available: true });
    }
}

export const getUsers = async (req, res) => {
    const search = req.body.keyword || "";
    if (search === "") {
        res.send([]);
    }
    else {
        User.find({ username: { $regex: search, $options: "i" } }, (err, responce) => {
            if (err) {
                res.send(err);
            }
            else {
                responce.forEach(function (v) { v.password = undefined });
                res.send(responce);
            }
        })
    }
}

export const updateUser = async (req, res) => {
    const googleUserUpdate = req.body.googleUserUpdate;
    if (googleUserUpdate) {
        let suser = req.body.user;
        if (suser.username === undefined || suser.username === "") {
            suser.username = suser.name.split(" ").join("").toLowerCase() + suser.sub.substr(suser.sub.length - 3);
        }
        const resp = await User.find({ username: suser.username });
        if (resp.length > 0) {
            res.status(201).json({ username_available: false, message: "Username already taken" });
        } else {
            suser.password = suser.sub;
            suser.googleId = suser.sub;
            const user = new User(suser);
            const responce = await user.save();
            if (responce) {
                const token = jwt.sign({ id: responce._id }, process.env.JWT_SECRET);
                res.status(200).json({ loginStatus: true, updatedUser: responce, token });
            } else {
                res.status(201).json({ loginStatus: false, message: "Error occured, please try again after sometime" })
            }
        }
    } else {
        const suser = req.body.user;
        delete suser.__v;
        const user = await User.findOne({ _id: suser._id });
        Object.assign(user, suser);
        const responce = await user.save();
        if (responce) {
            res.status(200).json({ updatedUser: responce });
        } else {
            res.status(201).json({ message: 'Error occured, please try again after sometime' });
        }
    }
}

export const signup = async (req, res) => {
    try {
        const username = req.body.username;
        const name = req.body.name;
        const bio = req.body.bio;
        const regpassword = req.body.password;
        const picture = req.body.picturePath;
        const newPassword = await bcrypt.hash(regpassword, salt);
        User.find({ username: username }, async (err, resp) => {
            if (err) {
                console.log(err);
                res.status(200).send({ message: "Some error has occured, please try again later.!", loginStatus: false });
            } else if (resp.length > 0) {
                res.status(200).send({ message: "Username already Exists", loginStatus: false });
            } else {
                const user = new User({ username, password: newPassword, name: name, bio: bio, picture: picture });
                const responce = await user.save();
                const token = jwt.sign({ id: responce._id }, process.env.JWT_SECRET);
                responce.password = undefined;
                res.status(201).json({ user: responce, message: "Account Successfully Created", token: token, loginStatus: true });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message, loginStatus: false });
    }
}