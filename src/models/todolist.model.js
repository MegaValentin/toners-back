import mongoose from "mongoose";

const { Schema } = mongoose;

const todolistSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  usuarioAsignado: {
    type: String,
    default: null,
  },
  estado: {
    type: String,
    enum: ["pendiente", "en proceso", "finalizado"],
    default: "pendiente",
  },
  solucionDescripcion: {
    type: String,
    required: function () {
      return this.estado === "finalizado";
    },
  },
});

todolistSchema.pre("save", function (next) {
  if (this.usuarioAsignado && this.estado !== "finalizado") {
    this.estado = "en proceso";
  } else if (!this.usuarioAsignado) {
    this.estado = "pendiente";
  }
  next();
});

export default mongoose.model("TodoList", todolistSchema);
