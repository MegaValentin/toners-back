import mongoose from "mongoose";
import User from "./users.model.js"

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

todolistSchema.pre("save", async function (next){
  if(this.usuarioAsignado){
    
    const usuario = await User.findOner({username: this.usuarioAsignado})
    
    if(!usuario || (usuario.role !== "admin" && usuario.role !== "superadmin")){
      return next(new Error("El usuario asignado debe tener rol 'admin' o 'superadmin'"))
    }

    if(this.estado !== "finalizado"){
      this.estado = "en proceso"
      
    }else{
      this.estado = "pendiente"
    }
  }
  next()
})


export default mongoose.model("TodoList", todolistSchema);
