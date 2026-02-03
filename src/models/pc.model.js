import mongoose from "mongoose";
import User from "./users.model.js";

const { Schema } = mongoose;

const pcSchema = new mongoose.Schema(
  {
    area: {
      type: Schema.Types.ObjectId,
      res: "Area",
      required: true,
    },
    areaName: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
    porqueSeTrajo: {
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
    solucion: {
      type: String,
      required: function () {
        return this.estado === "finalizado";
      },
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
      get: (date) => date.toISOString().split("T")[0],
    },
    fechaInicio: {
      type: Date,
      default: null,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
    },
    fechaFinalizacion: {
      type: Date,
      default: null,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
    },
  },
  { toJSON: { getters: true }, toObject: { getters: true } }
);

pcSchema.pre("save", async function (next) {
  if (this.isModified("usuarioAsignado") && this.usuarioAsignado) {
    const usuario = await User.findOne({ username: this.usuarioAsignado });
    if (
      !usuario ||
      (usuario.role !== "admin" && usuario.role !== "superadmin")
    ) {
      return next(
        new Error("El usuario asignado debe tener rol 'admin' o 'superadmin'")
      );
    }
  }
  next();
});

pcSchema.pre("findOneAndUpdate", async function (next) {
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

export default mongoose.model("PC", pcSchema);
