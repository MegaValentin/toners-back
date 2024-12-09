import Hardware from "../models/hardware.model.js";
import Areas from "../models/areas.model.js";
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const getHardwares = async (req, res) => {
  try {
    const hardaware = await Hardware.find();
    res.json(hardaware);
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar las ordenes" });
  }
};

export const getHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const hardware = await Hardware.findById(id);

    if (!hardware) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    res.json(hardware);
  } catch (error) {
    console.error("Error al obtener la orden: ", error);
    res.status(500).json({
      message: "Error al obtneer la orden",
    });
  }
};

export const addHardwares = async (req, res) => {
  try {
    const { hardware, area, description } = req.body;

    if (!hardware || !area || !description) {
      return res.status(400).json({
        message: "Los campos 'Hardware', 'area', 'description' son requeridos",
      });
    }

    const areaExists = await Areas.findById(area);

    if (!areaExists) {
      return res.status(404).json({
        message: "El area expecificada no existe",
      });
    }

    const newOrderHardware = new Hardware({
      hardware,
      area,
      areaName: areaExists.area,
      description,
    });

    console.log(newOrderHardware);

    const savedOrderHardware = await newOrderHardware.save();

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Orden_Hardware.pdf"
    );

    doc.pipe(res);
    
    doc.image("../logoReporte.jpg", {
      fit: [150, 150], 
      align: "center", 
      valign: "top",  
    });
    
    
    doc.moveDown(6);

    doc.fontSize(12);
    const formattedDate = format(
      new Date(savedOrderHardware.fecha),
      "d 'de' MMMM 'de' yyyy",
      { locale: es }
    );

    doc.text(`Bolivar, ${formattedDate}`, {
      align: "right",
    });

    doc.moveDown(3);
    
    doc.text("Jefe de Compras", {
      align: "left",
    });
    doc.text("Sr. Eugenio Silva", {
      align: "left",
    });
    doc.text("Municipalidad de Bolivar", {
      align: "left",
    });

    doc.moveDown(2);
    

    doc.text("Tengo el agrado de dirigirme a Ud, a fin de solicitarle.", {
      align: "right",
    });
    hardware.forEach((item) => {
      doc.text(` - ${item}`, {
        align: "center",
      }); // Enumerar cada hardware
    });

    doc.moveDown(3);
    

    doc.text(`${savedOrderHardware.description}`);
    doc.text(`Área solicitante: ${savedOrderHardware.areaName}`);

    doc.moveDown(2);
    

    doc.text(
      " Sin otro particular aprovecho la oportunidad para saludarlo atte ",
      {
        align: "right",
      }
    );

    doc.moveDown(2);
    
    doc.text("Departamento de Sistemas", {
      align: "left",
    });

    doc.end();

  } catch (error) {
    console.error("Error al agregar la orden", error);
    res.status(500).json({
      message: "Error al agregar la orden",
    });
  }
};

export const deleteHardware = async (req, res) => {
  try {
    const hardwareDelete = await Hardware.findByIdAndDelete(req.params.id);
    if (!hardwareDelete)
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    res.json({
      message: "Orden eliminada exitosamente",
      hardwareDelete,
    });
  } catch (error) {
    console.error("Error al eliminar la orden: ", error);
    res.status(500).json({
      message: "Error al eliminar la orden",
    });
  }
};

export const confirmOrderHardware = async (req, res) => {
  const { id } = req.params;

  try {
    const orderHardware = await Hardware.findById(id);
    if (orderHardware) {
      orderHardware.confirm = true;
      await orderHardware.save();
      res.status(200).json({ message: "Order delivered", orderHardware });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {}
};

