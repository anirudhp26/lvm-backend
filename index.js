import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { signup } from './controllers/auth.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
dotenv.config();

const app = express();


app.use(express.json());


// cookie management
app.use(cors({
    origin: ["http://localhost:3000", "https://test-4e8c8.web.app", "https://learnwithme-b8c40.web.app"],
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
app.post('/auth/signup', signup);
app.use('/auth', authRoutes);


const port = process.env.PORT || 3001;

app.listen(port, (req,res) => {
    console.log("SERVER IS RUNNING AT PORT 3001");
});

