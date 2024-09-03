import mongoose from "mongoose";

const unidadImagenSchema = new mongoose.Schema({
    marca:{
        type:String,
        require:true,
    },
    unidadImagen: {
        type: String,
        required: true,
        trim:true
    },
    cantidad:{
        type:Number,
        required:true,
        min:0
    }

})

export default mongoose.model('UnidadImagen', unidadImagenSchema)