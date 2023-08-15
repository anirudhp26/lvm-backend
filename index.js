import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { verifyToken } from './middleware/auth.js';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://test-4e8c8.web.app", "https://learnwithme-b8c40.web.app", "https://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://test-4e8c8.web.app", "https://learnwithme-b8c40.web.app", "https://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

let online_users = {};

io.on("connection", (socket) => {
    console.log(`User joined ${socket.id}`);
    socket.on("newuser", async ({ username, userId }) => {
        if (online_users[username]) {
            online_users[username].socketId = socket.id;
        } else {
            online_users[username] = {socketId: socket.id, userId};
        }
        console.log(online_users);
    })

    socket.on("send_notification_follow", async ({ from, to}) => {
        if (online_users[to]) {
            socket.to(online_users[to].socketId).emit("recieve_notification", { notification: `You just impressed ${from}` });
        }
    })

    socket.on("disconnect", async () => {
        const disconnectedUser = Object.keys(online_users).find(key => online_users[key].socketId === socket.id);
        if (disconnectedUser) {
            delete online_users[disconnectedUser];
        }
        console.log('A user disconnected:', socket.id);
        console.log(online_users);
    })
});

//mongodb connection
mongoose.set("strictQuery", true);
const uri = process.env.ATLAS_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("DATABASE CONNECTED SUCCESFULLY");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

//authentication Part
app.use('/auth', authRoutes);
app.use('/blog', verifyToken, blogRoutes);

const port = process.env.PORT || 3001;
server.listen(port, (req, res) => {
    console.log(`SOCKET AND SERVER BOTH RUNNING ON PORT ${port}`);
})