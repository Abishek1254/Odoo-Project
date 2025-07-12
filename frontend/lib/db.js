import mongoose from "mongoose";
import { DB_NAME } from "./../constants.js";
import dotenv from "dotenv";


dotenv.config({
    path: "../.env"
});



async function connectToDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n Connected to MongoDB DBHOST`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

// connectToDB();

export default connectToDB;