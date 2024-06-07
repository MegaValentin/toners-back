import mongoose from "mongoose";

const stockIdealSchema = new mongoose.Schema({
    toner: {
        type: String,
        required: true,
        trim: true
    },
      cantidadIdeal: {
        type: Number,
        required: true,
        min: 0
    }
})

export default mongoose.model('StockIdeal', stockIdealSchema)