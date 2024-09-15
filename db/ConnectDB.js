import mongoose  from "mongoose"
import dotenv from 'dotenv'
dotenv.config();

export const Connectdb = async()=>{
    try {
        console.log("MONGO_URI",process.env.MONGO_URI);
        const conn= await mongoose.connect("mongodb+srv://kelidevske:Wanted2964@master.uiayk.mongodb.net/auth_db?retryWrites=true&w=majority&appName=master");
        console.log(`Mongodb connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log("Error connecting to database", error.message);
        process.exit(1)
    }
}