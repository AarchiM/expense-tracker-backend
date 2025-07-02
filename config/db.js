import mongoose from "mongoose";

export const connectDB = async () =>
{
    try {
        const url = process.env.URL;
        const connect = await mongoose.connect(url)
        console.log("DataBase Connected successfully : ", connect.connection.host);

    } catch (error) {
        console.log("Error: ",error);        
    }    
}