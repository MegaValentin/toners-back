import mongoose from "mongoose";

const { Schema } = mongoose;

const areaUsageSchema = new mongoose.Schema({
    area: {
      type: Schema.Types.ObjectId,
      ref: 'Area',
      required: true
    },
    areaName: {
      type: String,
      required: true
    },
    toners: [{
      toner: {
        type: Schema.Types.ObjectId,
        ref: 'Toner',
        required: true
      },
      tonerName: {
        type: String,
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }],
    fecha: {
      type: Date,
      default: Date.now
    }
    
    
  });
  
  export default mongoose.model('AreaUsage', areaUsageSchema);