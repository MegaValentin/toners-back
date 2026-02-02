import PC from "../models/pc.model.js";
import User from "../models/users.model.js";
import Areas from "../models/areas.model.js";
import exceljs from "exceljs";

export const getPCs = async (req, res) => {
  try {
    const pc = await PC.find();
    res.json(pc);
  } catch (error) {
    return res.status(500).json({ message: "error al buscar las pc" });
  }
};

export const getPC = async (req, res) => {
  try {
    
    const { id } = req.params
    const pc = await PC.findById(id)
  
    if(!pc){
      return res.status(404).json({
        message: "Tarea no encontrada"
      })
    }
  
    res.json(pc)
  } catch (error) {
    console.error("Error al obtener la pc: ", error)
    res.status(500).json({
      message: "Error al obtener la pc"
    })
  }


}

export const addPC = async (req, res) => {
  try {
    const { area, porqueSeTrajo, ip } = req.body;

    if (!porqueSeTrajo || !ip) {
      return res.status(400).json({
        message: "Los campos 'area', 'porqueSeTrajo' y 'ip' son necesarios",
      });
    }

    const areaExists = await Areas.findById(area);

    if (!areaExists) {
      return res.status(400).json({
        message: "El area especificado no existe",
      });
    }

    const pcParaArreglar = new PC({
      area,
      areaName: areaExists.area,
      ip,
      porqueSeTrajo,
      usuarioAsignado: null,
      estado: "pendiente",
    });

    const pcParaArreglarGuarda = await pcParaArreglar.save();
    res.status(201).json(pcParaArreglarGuarda);
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};

export const assignPc = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const userLoggedIn = req.user;

    if (
      !userLoggedIn ||
      (userLoggedIn.role !== "admin" && userLoggedIn.role !== "superadmin")
    ) {
      return res.status(403).json({
        error: "Permiso denegado. El usuario deber ser 'admin' o 'superadmin'",
      });
    }

    const usuario = await User.findOne({ username });
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario al que se va asignar no encontrado",
      });
    }

    const pc = await PC.findByIdAndUpdate(
      id,
      { usuarioAsignado: username, estado: "en proceso" },
      { new: true }
    );

    if (!pc) {
      return res.status(404).json({
        error: "Tarea no encontrada",
      });
    }
    res.json(pc);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deletePC = async (req, res) => {
  try {
    const pcDelete = await PC.findByIdAndDelete(req.params.id);
    if (!pcDelete) {
      return res.status(404).json({
        message: "Pc no encontrada",
      });
    }
    res.json({
      message: "PC eliminada exitosamente",
      pcDelete,
    });
  } catch (error) {
    console.error("Error al eliminar la pc:", error);
    res.status(500).json({
      message: "Error al eliminar la pc",
    });
  }
};

export const getMyPC = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    const pc = await PC.find({
      usuarioAsignado: userLoggedIn.username,
      estado: { $in: ["en proceso", "finalizado"] },
    });
    res.json(pc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const completePC = async (req, res) => {
  try {
    const { id } = req.params;
    const { solucion } = req.body;

    const pc = await PC.findByIdAndUpdate(
      id,
      { estado: "finalizado", solucion },
      { new: true }
    );

    if (!pc) {
      return res.status(404).json({ error: "Pc no encontrada" });
    }

    res.json(pc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const revertPC = async (req, res) => {
  try {
    const { id } = req.params;

    const pc = await PC.findById(id);
    if (!pc) {
      return res.status(404).json({ error: "PC no encontrada" });
    }
    if (pc.estado !== "en proceso") {
      return res
        .status(400)
        .json({ error: "La PC no esta en el estado 'en proceso'" });
    }

    pc.estado = "pendiente";
    pc.usuarioAsignado = null;
    await pc.save();

    res.json({
      message: "El estado de la pc ha sido revertido",
      pc,
    });
  } catch (error) {
    console.error("Error en reverPC", error);
    res.status(500).json({
      error: "Error interno del servidor al intentar revertir la pc",
    });
  }
};

export const generatePCReport = async (req, res) => {
  try {
    const pc = await PC.find({ estado: "finalizado" });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(
      "Reporte de Mantenimiento de PC realizadas"
    );

    worksheet.columns = [
      { header: "Fecha", key: "fechaCreacion", width: 20 },
      { header: "Área", key: "areaName", width: 20 },
      { header: "IP", key: "ip", width: 20 },
      { header: "Falla", key: "porqueSeTrajo", width: 20 },
      { header: "Usuario Asignado", key: "usuarioAsignado", width: 20 },
      { header: "Solucion", key: "solucion", width: 20 },
    ];

    pc.forEach((pc) => {
      workbook.addRow({
        fechaCreacion: pc.fechaCreacion,
        areaName: pc.areaName,
        falla: pc.porqueSeTrajo,
        usuarioAsignado: pc.usuarioAsignado,
        solucion: pc.solucion,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Reporte_Ordenes.xlsx"
    );

    await workbook.xlsx.write(res)
  } catch (error) {
    console.error("Error al generar el reporte: ", error)
    res.status(500).json({ message: "Error al generer el reporte: ", error})
  }
}
