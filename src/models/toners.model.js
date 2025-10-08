import mongoose from "mongoose";

const tonersSchema = new mongoose.Schema({
    marca:{
        type: String,
        require:true,
    },
    toner: {
        type: String,
        required: true,
        trim: true
    },
      cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    cantidadIdeal : {
        type: Number,
        required: true,
        min: 0
    }
  
})

export default mongoose.model('Toners', tonersSchema)