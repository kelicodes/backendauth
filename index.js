import express from "express";
import { Connectdb } from "./db/ConnectDB.js";
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from '../backend/routes/auth.js'

const app = express();
dotenv.config();
app.use(cors({origin: "http://localhost:5173" , credentials:true}))
app.use(express.json())
app.use(cookieParser())//allows us to parse coookies

const port = process.env.PORT || 5000;

app.use('/api/auth',authRoutes);

app.listen(port,()=>{
    Connectdb();
    console.log(`server running on port ${port}`);
    
})