import StockIdeal from "../models/stockIdeal.model.js"
import Toners from "../models/toners.model.js"
import xlsx from 'xlsx';
import fs from 'fs';
import path from "path";
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

export const createIdealStock = async (req, res) => {
    const file = req.file; 
    
    if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Leer el archivo Excel
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    
    const newIdealStocks = jsonData.map((row) => ({
      marca: row.Marca,
      toner: row.Toner,
      stockIdeal: row.Cantidad || 0,  
    }));
    
    await StockIdeal.insertMany(newIdealStocks);

    
    fs.unlinkSync(file.path);

    res.status(201).json({ message: 'Stock ideal creado desde el archivo Excel' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getIdealStocks = async (req, res) => {
  try {
    const idealStocks = await StockIdeal.find();
    res.status(200).json(idealStocks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const checkDataExists = async (req, res) => {
  try {
    const count = await StockIdeal.countDocuments();
    res.status(200).json({ dataExists: count > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pedidoStock = async (req, res ) => {
  try {
    const currentStock = await Toners.find({})
    const idealStocks = await StockIdeal.find({})

    const stockCompare = idealStocks.map((ideal)=>{
      const current = currentStock.find(item => item.toner === ideal.toner)
      const currentCantidad = current ? current.cantidad : 0
      const needed = ideal.stockIdeal - currentCantidad

      return {
        marca: ideal.marca,
        toner: ideal.toner,
        ideal : ideal.stockIdeal,
        current : currentCantidad,
        needed: needed > 0 ? needed : 0
      }
      
    })
    res.status(200).json(stockCompare)
  } catch (error) {
    res.status(500).json([{error: error.message}])
  }
}

export const enviarPedidoStock = async (req, res) => {
  try {
    const stockIdeal = await StockIdeal.find();
    const stockActual = await Toners.find();

    const recommendedOrder = stockIdeal.map(ideal => {
      const actual = stockActual.find(a => a.toner === ideal.toner) || { Cantidad: 0 };
      const currentCantidad = actual ? actual.cantidad : 0
      const pedido = ideal.stockIdeal  - currentCantidad
      return {
        Marca: ideal.marca,
        Toner: ideal.toner,
        Pedido: pedido
      };
    }).filter(order => order.Pedido > 0);

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gestiondetoner@gmail.com',
          pass: 'r q y g z cm p e j b g q f l e'
        }
      });

      const mailOptions = {
        from: 'gestiondetoner@gmail.com',
        to: 'gestiontoner@bolivar.gob.ar',
        subject: 'Pedido Recomendado',
        text: 'Adjunto el pedido recomendado en formato PDF.',
        attachments: [
          {
            filename: 'pedido-recomendado.pdf',
            content: pdfData
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send('Correo enviado correctamente.');
    });

    doc.fontSize(12).text('Pedido Recomendado:', { underline: true });
    recommendedOrder.forEach(order => {
      doc.text(`${order.Marca} ${order.Toner} ........ ${order.Pedido}`);
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
}
