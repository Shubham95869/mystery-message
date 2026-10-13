
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
const connection : ConnectionObject ={};

async function dbConnect() : Promise<void> {
    if (connection.isConnected === 1) {
        console.log("Already connected to db");
        return;
    }

    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is missing from .env")
        }

        const db = await mongoose.connect(mongoUri);

        connection.isConnected = db.connection.readyState;

        console.log("db connected successfully");


    } catch (error) {
        connection.isConnected = 0;

        console.error("db connection failed", error);
        throw error;

        

    }
    

}

export default dbConnect;