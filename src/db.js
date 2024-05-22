import mongoose from "mongoose";

const urlDB = "mongodb://localhost:27017/sistoners";

export const connectDB = async () => {
  try {
    await mongoose.connect(urlDB);
    console.log("db is concected");
  } catch (error) {
    console.log(error);
  }
};