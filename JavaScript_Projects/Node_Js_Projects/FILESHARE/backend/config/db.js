import mongoose from "mongoose";
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Server is connect succesfully to MONGODB ${conn.connection.host}`);
    }catch(error){
        console.error(`Server failed to connect to mongoDb DataBase:`, error.message);
        process.exit(1);
    }
}

export default connectDB;