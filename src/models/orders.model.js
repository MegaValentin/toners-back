import mongoose from "mongoose";

const { Schema } = mongoose;

const ordersSchema = new mongoose.Schema({
  toner: {
    type: Schema.Types.ObjectId,
    ref: 'Toner',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Orden', ordersSchema)