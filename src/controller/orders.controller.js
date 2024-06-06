import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from "../models/orders.model.js";
import Toners from "../models/toners.model.js";
import Areas from "../models/areas.model.js";
import AreaUsage from "../models/areaUsage.model.js";

export const getOrders = async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "error al buscar las ordenes" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    res.status(500).json({
      message: "Error al obtener la orden",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deleteOrder)
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    res.json({
      message: "Orden eliminada exitosamente",
      deleteOrder,
    });
  } catch (error) {
    console.error("Error al eliminar el toner:", error);
    res.status(500).json({
      message: "Error al eliminar el toner",
    });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addOrders = async (req, res) => {
  try {
    const { toner, cantidad, area, email } = req.body;

    if (!toner || !cantidad || !area) {
      return res.status(400).json({
        message: "Los campos 'toner', 'cantidad' y 'area' son requeridos",
      });
    }

    const tonerExists = await Toners.findById(toner);
    const areaExists = await Areas.findById(area);

    if (!tonerExists) {
      return res.status(404).json({
        message: "El toner especificado no existe",
      });
    }
    if (!areaExists) {
      return res.status(404).json({
        message: "El area especificado no existe",
      });
    }
    if (tonerExists.cantidad < cantidad) {
      return res.status(400).json({
        message: "cantidad insuficiente de toner",
      });
    }

    const newOrder = new Order({
      toner,
      tonerName: tonerExists.toner,
      cantidad,
      area,
      areaName: areaExists.area,
    });

    console.log(newOrder);

    const savedOrder = await newOrder.save();

    tonerExists.cantidad -= cantidad;
    await tonerExists.save();

    const pdfPath = path.join(__dirname, `order-${savedOrder._id}.pdf`);
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(pdfPath))

    doc.fontSize(25).text('Entrega de Toner', {align:'center'})
    doc.moveDown()
    doc.fontSize(14).text(`Fecha: ${new Date().toLocaleDateString()}`)
    doc.moveDown()
    doc.text(`Area: ${areaExists.area}`)
    doc.text(`Toner: ${tonerExists.toner}`)
    doc.text(`Cantidad: ${cantidad}`)
    doc.moveDown()
    doc.text('Firma: ', {underline:true})
    doc.text('Nombre y Apellido:', {underline:true})

    doc.end()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user:'gestiondetoner@gmail.com',
        pass:'r q y g z cm p e j b g q f l e'
      }
    })

    const mailOptions = {
      from: 'gestiondetoner@gmail.com',
      to: 'valentinmega3@gmail.com',
      subject: 'Confirmación de Entrega de Tóner',
      text: 'Adjunto encontrará el PDF con los detalles de la entrega del tóner.',
      attachments: [
        {
          filename: `order-${savedOrder._id}.pdf`,
          path: pdfPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo PDF:', err);
        } else {
          console.log('Archivo PDF eliminado:', pdfPath);
        }
      })
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
   

    let areaUsage = await AreaUsage.findOne({ area });
    if (!areaUsage) {
      areaUsage = new AreaUsage({
        area,
        areaName: areaExists.area,
        toners: [],
      });
    }

    const tonerUsageIndex = areaUsage.toners.findIndex((t) =>
      t.toner.equals(toner)
    );
    if (tonerUsageIndex !== -1) {
      areaUsage.toners[tonerUsageIndex].cantidad += cantidad;
    } else {
      areaUsage.toners.push({
        toner,
        tonerName: tonerExists.toner,
        cantidad,
      });
    }

    await areaUsage.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error al agregar la orden", error);
    res.status(500).json({
      message: "Error al agregar la orden",
    });
  }
};

export const getAreaUsage = async (req, res) => {
    try {
        const areaUsage = await AreaUsage.find();
        res.json(areaUsage);
      } catch (error) {
        return res.status(500).json({ message: "error al buscar las ordenes" });
      }
}
