import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes  from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials :true
}))
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("successfully connected to the database...");
    })
    .catch(err => {
        console.log("mongoose server connection error : ", err);
    })


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`server is running on port ${port}...`);
})