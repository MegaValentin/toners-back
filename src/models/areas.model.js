import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
})

export default mongoose.model('Areas', officeSchema)