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
import { signup } from './controllers/auth.js';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://learnwithme-b8c40.web.app", "https://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

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

// routes with files
app.post('/auth/signup', upload.single("picture"), signup);

//authentication Part
app.use('/auth', authRoutes);
app.use('/blog', verifyToken, blogRoutes);

const port = process.env.PORT || 3001;
app.listen(port, (req, res) => {
    console.log(`SERVER RUNNING ON PORT ${port}`);
})