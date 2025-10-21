import mongoose from "mongoose";

const printSchema = new mongoose.Schema({
    marca:{
        type: String,
        required: true
    },
    modelo: {
        type: String, 
        required: true,
        trim: true
    },
    toner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Toner',
        required: true
    },
    tonerName: {
        type: String,
        required: true
    }
})

export default mongoose.model('Print', printSchema)