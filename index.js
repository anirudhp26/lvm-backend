import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
dotenv.config();

const app = express();


app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "https://test-4e8c8.web.app", "https://learnwithme-b8c40.web.app", "https://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

//mongodb connection
mongoose.set("strictQuery", true);
const uri = process.env.ATLAS_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("DATABASE CONNECTED SUCCESFULLY");
});

//authentication Part
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

const port = process.env.PORT || 3001;

app.listen(port, (req,res) => {
    console.log("SERVER IS RUNNING AT PORT 3001");
});

