import mongoose from "mongoose";

const stockIdealSchema =new mongoose.Schema({
    toner: { type: String, required: true, unique: true },
    stockIdeal: { type: Number, required: true },
  });


export default mongoose.model('StockIdeal', stockIdealSchema)