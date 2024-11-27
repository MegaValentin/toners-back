import mongoose from "mongoose";

const { Schema } = mongoose;

const hardwareSchema = new mongoose.Schema({
    hardware:{
        type:String,
        required: true
    },
    area:{
        type: Schema.Types.ObjectId,
        ref:'Area',
        required: true
    },
    areaName:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    fecha:{
        type:Date,
        default: Date.now
    },
    confirm:{
        type: Boolean,
        default: false
      }
})

export default mongoose.model('Hardware', hardwareSchema)