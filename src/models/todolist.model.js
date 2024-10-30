import mongoose from "mongoose";
import User from "./users.model.js"

const { Schema } = mongoose;

const todolistSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area',
    required: true
  },
  areaName:{
    type:String,
    required:true
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
  fechaCreacion: {
    type: Date,
    default: Date.now,
    get: (date) => date.toISOString().split("T")[0]
  },
  fechaInicio: {
    type: Date,
    default: null,
    get: (date) => (date ? date.toISOString().split("T")[0] : null)
  },
  fechaFinalizacion: {
    type: Date,
    default: null,
    get: (date) => (date ? date.toISOString().split("T")[0] : null)
  }
},{ toJSON: { getters: true }, toObject: { getters: true } });

// Middleware pre-save para asignar fecha de creación
todolistSchema.pre("save", async function (next) {
  if (this.isModified("usuarioAsignado") && this.usuarioAsignado) {
    const usuario = await User.findOne({ username: this.usuarioAsignado });
    if (!usuario || (usuario.role !== "admin" && usuario.role !== "superadmin")) {
      return next(new Error("El usuario asignado debe tener rol 'admin' o 'superadmin'"));
    }
  }
  next();
});

// Middleware pre-findOneAndUpdate para actualizar fechas en cambios de estado
todolistSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  
  switch (update.estado) {
    case "en proceso":
      if (!this.get("fechaInicio")) {
        update.fechaInicio = new Date();
      }
      break;
      
    case "finalizado":
      if (!this.get("fechaFinalizacion")) {
        update.fechaFinalizacion = new Date();
      }
      break;
      
    case "pendiente":
      update.fechaInicio = null;
      update.fechaFinalizacion = null;
      break;
      
    default:
      break;
  }

  next();
});


export default mongoose.model("TodoList", todolistSchema);
