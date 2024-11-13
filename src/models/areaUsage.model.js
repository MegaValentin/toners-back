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
        
      },
      tonerName: {
        type: String,
        
      },
      cantidad: {
        type: Number,
        min: 1
      }
    }],
    uni: [{
      unidadImagen: {
        type: Schema.Types.ObjectId,
        ref: 'UnidadImagen'
      },
      UnidadImagenName: {
        type: String
      },
      cantidad: {
        type: Number,
        min: 1
      }
    }],
    fecha: {
      type: Date,
      default: Date.now
    }
    
    
  });
  
  export default mongoose.model('AreaUsage', areaUsageSchema);