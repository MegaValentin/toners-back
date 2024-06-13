import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const urlDB = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(urlDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;