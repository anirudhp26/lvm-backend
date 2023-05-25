import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const salt = 1;

export const login = async (req, res) => {
    const regusername = req.body.username;
    const regemail = req.body.email;
    const regpassword = req.body.password;
    User.find({ username: regusername } || { email: regemail }, (err, responce) => {
        if (err != undefined) {
            res.status(401).json({ loginStatus: false, message: 'Some Error encountered, Please try again after sometime' })
        }
        if (responce.length == 0) {
            res.status(401).json({ loginStatus: false, message: 'No such User exists' })
        } else {
            bcrypt.compare(regpassword, responce[0].password, (error, valid) => {
                if (error) {
                    res.status(401).json({ loginStatus: false, message: 'Some Error encountered, Please try again after sometime' })
                }
                if (valid) {
                    console.log(responce[0]._id);
                    const token = jwt.sign({ id: responce[0]._id }, process.env.JWT_SECRET);
                    delete responce[0].password;
                    res.status(200).json({ user: regusername, loginStatus: true, token });
                } else {
                    res.status(401).json({ loginStatus: false, message: 'Incorrect Password' })
                }
            });
        };
    });
};

export const getUsers = async (req,res) => {
    const search = req.body.keyword || "";
    if (search === "") {
        res.send([]);
    }
    else{
        User.find({username: {$regex: search, $options: "i"}}, (err,responce) => {
            if (err) {
                res.send(err);
            }
            else{
                res.send(responce);
            }
        })
    }
}

export const signup = async (req,res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const regpassword = req.body.password;
        const newPassword = await bcrypt.hash(regpassword,salt);
        const user = new User({username, email, password: newPassword});
        const responce = await user.save();
        res.status(201).json({ user: responce, message: "Account Created" });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}