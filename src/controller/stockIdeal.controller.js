import StockIdeal from "../models/stockIdeal.model.js"
import xlsx from 'xlsx';
import fs from 'fs';
import path from "path";


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
