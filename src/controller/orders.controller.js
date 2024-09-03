import fs from 'fs';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from "../models/orders.model.js";
import Toners from "../models/toners.model.js";
import Areas from "../models/areas.model.js";
import AreaUsage from "../models/areaUsage.model.js";
import dotenv from "dotenv";
import exceljs from 'exceljs';

dotenv.config();

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

export const removeUndeliveredOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.isDelivered) {
      return res.status(400).json({ message: 'Delivered orders cannot be deleted' });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Undelivered order deleted successfully' });
  } catch (error) {
    console.error('Error deleting undelivered order', error);
    res.status(500).json({ message: 'Error deleting undelivered order', error });
  }
};

export const deliveryToner = async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await Order.findById(id);
    if (order) {
      const toner = await Toners.findById(order.toner);
      if (toner) {
        if (toner.cantidad < order.cantidad) {
          return res.status(400).json({ message: 'No hay toner' });
        }
        toner.cantidad -= order.cantidad;
        if (toner.stock < 0) {
          toner.stock = 0; 
        }
        await toner.save(); 

        order.isDelivered = true;
        await order.save(); 

        let areaUsage = await AreaUsage.findOne({ area: order.area });
        if (!areaUsage) {
          areaUsage = new AreaUsage({
            area: order.area,
            areaName: order.areaName,
            toners: [],
          });
        }

        const tonerUsageIndex = areaUsage.toners.findIndex((t) =>
          t.toner.equals(order.toner)
        );
        if (tonerUsageIndex !== -1) {
          areaUsage.toners[tonerUsageIndex].cantidad += order.cantidad;
        } else {
          areaUsage.toners.push({
            toner: order.toner,
            tonerName: toner.toner,
            cantidad: order.cantidad,
          });
        }

        await areaUsage.save();

        res.status(200).json({ message: 'Order delivered and stock updated', order });
      } else {
        res.status(404).json({ message: 'Toner not found' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order and stock', error });
  }
}

export const addOrders = async (req, res) => {
  try {
    const { toner, cantidad, area } = req.body;

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
    

    const newOrder = new Order({
      toner,
      tonerName: tonerExists.toner,
      cantidad,
      area,
      areaName: areaExists.area,
    });

    console.log(newOrder);

    const savedOrder = await newOrder.save();

    
    await tonerExists.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error al agregar la orden", error);
    res.status(500).json({
      message: "Error al agregar la orden",
    });
  }
};

export const cancelOrder = async (req, res) => {
  const {id} = req.params

  try {
    const order = await Order.findById(id)

    if(!order){
      return res.status(404).json({message: 'Order not found'})
    }

    if(!order.isDelivered){
      return res.status(400).json({message: 'Order is not delivered, so it cannot be canceled'})
    }

    const toner = await Toners.findById(order.toner)
    if(!toner){
      return res.status(404).json({message: 'Toner not found'})
    }

    toner.cantidad += order.cantidad
    await toner.save()

    let areaUsage = await AreaUsage.findOne({area: order.area})
    if(areaUsage){
      const tonerUsageIndex = areaUsage.toners.findIndex((t)=>
      t.toner.equals(order.toner))

      if(tonerUsageIndex !== -1) {
        areaUsage.toners[tonerUsageIndex].cantidad -= order.cantidad;
        if (areaUsage.toners[tonerUsageIndex].cantidad <= 0) {
          areaUsage.toners.splice(tonerUsageIndex, 1);
        }
      }

      await areaUsage.save();

    order.isDelivered = false;
    await order.save();

    res.status(200).json({ message: 'Order canceled and stock updated', order });
    }
  } catch (error) {
    console.error('Error canceling order and updating stock', error);
    res.status(500).json({ message: 'Error canceling order and updating stock', error });
  }
}

export const getAreaUsage = async (req, res) => {
  try {
    const areaUsage = await AreaUsage.find();
    res.json(areaUsage);
  } catch (error) {
    return res.status(500).json({ message: "error al buscar las ordenes" });
  }
}

export const getMonthlyReport = async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          isDelivered: true, // Solo tomar en cuenta las órdenes entregadas
          fecha: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: { area: "$areaName", toner: "$tonerName" },
          totalCantidad: { $sum: "$cantidad" }
        }
      },
      {
        $group: {
          _id: "$_id.area",
          toners: {
            $push: {
              toner: "$_id.toner",
              cantidad: "$totalCantidad"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          areaName: "$_id",
          toners: 1
        }
      }
    ]);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Mensual');

    worksheet.columns = [
      { header: 'Área', key: 'areaName', width: 30 },
      { header: 'Toner', key: 'toner', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 20 }
    ];

    orders.forEach((order) => {
      const { areaName, toners } = order;
      toners.forEach((toner) => {
        worksheet.addRow({
          areaName: areaName,
          toner: toner.toner,
          cantidad: toner.cantidad
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Mensual.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte mensual", error });
  }
}


export const getYearlyReport = async (req, res) => {
  const {year } = req.query
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  try {
    const areaUsage = await AreaUsage.aggregate([
      {
        $match: {
          fecha: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $unwind: "$toners"
      },
      {
        $group: {
          _id: { area: "$area", areaName: "$areaName" },
          toners: {
            $push: {
              toner: "$toners.tonerName",
              cantidad: "$toners.cantidad"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          areaName: "$_id.areaName",
          toners: 1
        }
      }
    ]);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Mensual');

    worksheet.columns = [
      { header: 'Área', key: 'areaName', width: 30 },
      { header: 'Toner', key: 'toner', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 20 }
    ];

    areaUsage.forEach((usage) => {
      const { areaName, toners } = usage;
      toners.forEach((toner) => {
        worksheet.addRow({
          areaName: areaName,
          toner: toner.toner,
          cantidad: toner.cantidad
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Mensual.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte anual", error });
  }
}

export const createStock = async (req, res) => {
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


    for (const row of jsonData) {
      const { Toner, cantidad } = row;
      const newIdealStock = new stockIdeal({ toner: Toner, stockIdeal: cantidad });
      await newIdealStock.save();
    }


    fs.unlinkSync(file.path);

    res.status(201).json({ message: 'Stock ideal creado desde el archivo Excel' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const generateOrdersReport = async (req, res) => {
  try {
    
    const orders = await Order.find().sort({ fecha: -1 });

    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Órdenes');

    
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Área', key: 'areaName', width: 30 },
      { header: 'Toner', key: 'tonerName', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Estado', key: 'isDelivered', width: 15 },
    ];

    
    orders.forEach((order) => {
      const formattedDate = new Date(order.fecha).toLocaleDateString()
      worksheet.addRow({
        fecha: formattedDate,
        areaName: order.areaName,
        tonerName: order.tonerName,
        cantidad: order.cantidad,
        isDelivered: order.isDelivered ? 'Entregado' : 'No Entregado',
      });
    });

    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Reporte_Ordenes.xlsx'
    );

    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating orders report:', error);
    res
      .status(500)
      .json({ message: 'Error generating orders report', error });
  }
};