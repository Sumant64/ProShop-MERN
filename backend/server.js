import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";

dotenv.config();
connectDB();


const PORT = process.env.PORT || 5000;
const app = express();

app.get('/', (req, res) => {
    res.send('api is running...')
})

app.listen(PORT, () => console.log(`app is running in port ${PORT}`))
