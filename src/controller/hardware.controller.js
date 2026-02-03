import Hardware from "../models/hardware.model.js";
import Areas from "../models/areas.model.js";
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const logoPath = path.join(__dirname, "../assets/logoReporteNuevo.jpg");

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

    if (!hardware || hardware.length === 0) {
      return res.status(400).json({ message: "Debe agregar hardware" });
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

    doc.image(logoPath, {
      fit: [150, 150],
      align: "center",
    });
    doc.moveDown(6);

    doc.fontSize(12);
    const formattedDate = format(
      new Date(savedOrderHardware.fecha),
      "d 'de' MMMM 'de' yyyy",
      { locale: es }
    );

    doc.text(`Bolívar, ${formattedDate}`, {
      align: "right",
    });

    doc.moveDown(3);

    doc.text("Jefe de Compras", {
      align: "left",
    });
    doc.text("Sra. Pia Pavia", {
      align: "left",
    });
    doc.text("Municipalidad de Bolívar", {
      align: "left",
    });

    doc.moveDown(2);

    doc.text("Tengo el agrado de dirigirme a Ud, a fin de solicitarle.", {
      align: "right",
    });
    doc.moveDown();

    const tableTop = doc.y;
    const rowHeight = 18;
    const startX = 90;
    const colHardwareW = 230;
    const colCantidadW = 80;
    const colHardwareX = startX;
    const colCantidadX = colHardwareX + colHardwareW;

    hardware.forEach((item, index) => {
      const y = tableTop + index * rowHeight;
      doc.rect(colHardwareX, y, colHardwareW, rowHeight).stroke();
      doc.rect(colCantidadX, y, colCantidadW, rowHeight).stroke();
      doc.text(item.nombre, colHardwareX + 5, y + 7, {
        width: doc.fontSize(10),
        align: "left",
      });
      doc.text(String(item.cantidad), colCantidadX, y + 7, {
        width: colCantidadW,
        align: "center",
      });
    });

    doc.y = tableTop + hardware.length * rowHeight + 20;
    doc.x = doc.page.margins.left;

    doc.moveDown(2);
    doc.fontSize(12);
    doc.text(savedOrderHardware.description);

    doc.moveDown(2);

    doc.text(
      "Sin otro particular aprovecho la oportunidad para saludarlo atte",
      { align: "right" }
    );

    doc.moveDown(2);

    doc.text("Departamento de Informatica");

    doc.end();
  } catch (error) {
    console.error("Error al agregar la orden", error);
    res.status(500).json({
      message: "Error al agregar la orden",
    });
  }
};

export const updatedHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardware, area, description } = req.body;

    if (!hardware || !area || !description) {
      return res.status(400).json({
        message: "hardware, area y descripcion son requeridos",
      });
    }

    const areaExists = await Areas.findById(area);
    if (!areaExists) {
      return res.status(404).json({
        message: "Area no encontrda",
      });
    }

    if (!Array.isArray(hardware) || hardware.length === 0) {
      return res.status(400).json({
        message: "Debe haber al menos un hardware",
      });
    }

    const updated = await Hardware.findByIdAndUpdate(
      id,
      {
        hardware,
        area,
        areaName: areaExists.area,
        description,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Orden actulizada correctamente",
        order: updated,
      });
    }
  } catch (error) {
    console.error("Error actualizando orden:", error);
    res.status(500).json({
      message: "Error al actualizar orden",
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

export const downloadDocs = async (req, res) => {
  try {
    const { id } = req.params;

    const logoPath = path.join(__dirname, "../assets/logoReporteNuevo.jpg");

    const savedOrderHardware = await Hardware.findById(id);
    if (!savedOrderHardware) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const { hardware, description, fecha } = savedOrderHardware;

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Orden_Hardware_${id}.pdf`
    );
    doc.pipe(res);
    doc.image(logoPath, {
      fit: [150, 150],
      align: "center",
    });
    doc.moveDown(4);
    const formattedDate = format(new Date(fecha), "d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
    doc.fontSize(12).text(`Bolivar, ${formattedDate}`, {
      align: "right",
    });
    doc.moveDown(3);
    doc.text("Jefe de Compras", { align: "left" });
    doc.text("Sra. Pia Pavia", { align: "left" });
    doc.text("Municipalidad de Bolivar", { align: "left" });
    doc.moveDown(2);
    doc.text("Tengo el agrado de dirigirme a Ud, a fin de solicitarle:", {
      align: "right",
    });
    doc.moveDown();
    const tableTop = doc.y;
    const rowHeight = 18;
    const startX = 90;
    const colHardwareW = 260;
    const colCantidadW = 40;
    const colHardwareX = startX;
    const colCantidadX = colHardwareX + colHardwareW;

    hardware.forEach((item, index) => {
      const y = tableTop + index * rowHeight;
      doc.rect(colHardwareX, y, colHardwareW, rowHeight).stroke();
      doc.rect(colCantidadX, y, colCantidadW, rowHeight).stroke();
      doc.text(item.nombre, colHardwareX + 5, y + 7, {
        width: colHardwareW - 10,
        align: "left",
      });
      doc.text(String(item.cantidad), colCantidadX, y + 7, {
        width: colCantidadW,
        align: "center",
      });
    });

    doc.y = tableTop + hardware.length * rowHeight + 20;
    doc.x = doc.page.margins.left;

    doc.moveDown(2);

    doc.text(savedOrderHardware.description);

    doc.moveDown(2);

    doc.text(
      "Sin otro particular aprovecho la oportunidad para saludarlo atte",
      { align: "right" }
    );

    doc.moveDown(2);

    doc.text("Departamento de Informática");

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
};
