import mongoose from "mongoose";

const { Schema } = mongoose;

const ordersUniSchema = new mongoose.Schema({
  uni: {
    type: Schema.Types.ObjectId,
    ref: "UnidadImagen",
    required: true,
  },
  uniName: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  isDelivered:{
    type: Boolean,
    default: false
  }
});

export default mongoose.model('OrdersUni', ordersUniSchema)
