import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
},{ timestamps: true })

export default mongoose.model('Areas', officeSchema)