import Toners from "../models/toners.model.js"
import xlsx from 'xlsx';
import fs from 'fs';
import excelJS from 'exceljs';
import nodemailer from 'nodemailer'

export const getToners = async (req, res) => {
    try {
        const toners = await Toners.find()
        res.json(toners)

    } catch (error) {
        return res.status(500).json({ message: "error al buscar El toner" })
    }
}

export const getToner = async (req, res) => {
    try {
        const { id } = req.params
        const toner = await Toners.findById(id)

        if (!toner) {
            return res.status(404).json({
                message: "Toner no encontrada"
            })
        }

        res.json(toner)

    } catch (error) {
        console.error('Error al obtener el toner:', error);
        res.status(500).json({
            message: "Error al obtener el toner"
        })
    }
}


export const deleteToner = async (req, res) => {
    try {

        const deleteToner = await Toners.findByIdAndDelete(req.params.id)
        if (!deleteToner) return res.status(404).json({
            message: "Toner no encontrada"
        })
        res.json({
            message: "Toner eliminada exitosamente",
            deleteToner
        })

    } catch (error) {
        console.error('Error al eliminar el toner:', error)
        res.status(500).json({
            message: "Error al eliminar el toner"
        })
    }
}

export const updatedToner = async (req, res) => {
    try {
        const { id } = req.params
        const { marca, toner, cantidad } = req.body

        if (!toner && cantidad === undefined && !marca) {
            return res.status(400).json({
                message: "El campor 'toner' y 'cantidad' son requeridos"
            })
        }

        const updatedToner = await Toners.findByIdAndUpdate(id, req.body, { new: true })

        if (!updatedToner) {
            return res.status(404).json({
                message: "Toner no encontrado"
            })
        }

        res.json(updatedToner)
    } catch (error) {
        console.error('Error al actualizar el toner:', error);
        res.status(500).json({
            message: "Error al actulizar el toner"
        })
    }
}

export const addToners = async (req, res) => {

    try {
        const { toner, cantidad, marca, cantidadIdeal } = req.body;

        if (!toner || !marca || cantidad === undefined || cantidadIdeal === undefined) {
            return res.status(400).json({ message: 'El nombre y la cantidad son requeridos' })
        }

        const normalizedToner = toner.trim().toLowerCase();
        // Busca si ya existe un toner con el nombre normalizado de forma insensible a mayúsculas/minúsculas
        const existingToner = await Toners.findOne({ toner: { $regex: `^${normalizedToner}$`, $options: 'i' } });

        if (existingToner) {
            existingToner.cantidad += cantidad;
            const updatedToner = await existingToner.save()
            res.status(200).json(updatedToner)
        } else {
            const newToner = new Toners({ marca, toner, cantidad, cantidadIdeal })
            const savedToner = await newToner.save()
            res.status(201).json(savedToner)
        }
    } catch (error) {
        console.log('Error al agregar el toner', error)
        res.status(500).json({ message: 'Error al agregar el toner.' })
    }
}

export const postReStock = async (req,res) => {
    try {
        const {tonerId, cantidad } = req.body

        if (!tonerId || !cantidad || cantidad <=0){
            return res.status(400).json({message: "El ID del toner y la cantidad son requeridos"})
        } 

        const toner = await Toners.findById(tonerId)
        if(!toner) {
            return res.status(404).json({message:"Toner no encontrado"})
        }

        toner.cantidad += cantidad
        await toner.save()

        
        res.status(200).json({message: "toner reabastecido exitosamente", toner})

    } catch (error) {
        console.error("Error en el restock de toner: ", error)
        res.status(500).json({message:"Error en el restock de toner:"})
    }
}

export const restockAllPost = async (req, res) => {
    try {
        const { restocks } = req.body

        if(!restocks || !Array.isArray(restocks)){
            return res.status(400).json({message:"Invalid restock data"})
        }
        
        const updatePromise = restocks.map(async (restock) => {
            const toner = await Toners.findById(restock.tonerId)

            if(toner){
                toner.cantidad += restock.cantidad
                toner.alert = toner.cantidad <=1
                await toner.save()
            }
        })

        await Promise.all(updatePromise)
        res.status(200).json({ message: 'Restock completed successfully', restocks});
    } catch (error) {
        console.error('Error in restock', error);
        res.status(500).json({message: 'Error in restock'})
    }
}

export const addAllToners = async (req,res) => {
    const file = req.file
    if (!file) {
        return res.status(400).json({error: "No file upload"})

    }

    try {
        const book = xlsx.readFile(file.path)
        const sheetName = book.SheetNames[0]
        const worksheet = book.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet)

        const newToner = data.map((row) => ({
            marca:row.Marca,
            toner:row.Toner,
            cantidad: row.Cantidad || 0
        }))

        await Toners.insertMany(newToner)

        fs.unlinkSync(file.path)

        res.status(201).json({message:'Stock creado desde el archivo Excel'})


    } catch (error) {
        res.status(500).json({ error: error.message })
    }

} 
export const reportToners = async (req,res) => {
    try {
        const toners = await Toners.find();
    
        if (!toners || toners.length === 0) {
          return res.status(404).json({ message: 'No toner data available' });
        }
    
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Current Stock Report');
    
        // Agregar encabezados
        worksheet.columns = [
         
          { header: 'Marca', key: 'marca', width: 25 },
          { header: 'Toner', key: 'toner', width: 25 },
          { header: 'Stock', key: 'cantidad', width: 25 },
        ];
    
        // Agregar filas de datos
        toners.forEach((toner) => {
          worksheet.addRow({
            marca: toner.marca,
            toner: toner.toner,
            cantidad: toner.cantidad,
          });
        });
    
        // Configurar el archivo para su descarga
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=current_stock_report.xlsx');
    
        await workbook.xlsx.write(res);
        res.status(200).end();
      } catch (error) {
        console.error('Error generating current stock report:', error);
        res.status(500).json({ message: 'Error generating current stock report' });
      }
}

export const getRecommendedOrders = async ( req, res ) => {
    try {
        const toners = await Toners.find()

        const getRecommendedOrders = toners.map(t => {
            const pedidoRecomendado = Math.max(t.cantidadIdeal - t.cantidad, 0)

            return {
                _id: t._id,
                marca: t.marca,
                toner: t.toner,
                cantidadActual: t.cantidad,
                cantidadIdeal: t.cantidadIdeal,
                pedidoRecomendado
              };
        })

        res.json(getRecommendedOrders)
    } catch (error) {
        res.status(500).json({ mesage: "Error al calcular el pedido recomendado"})
    }
}

export const getLowStockToners = async (req, res) => {
    try {
        const toners = await Toners.find()

        const lowStock = toners
            .filter(t => {
                if(t.cantidadIdeal <= 0) return false
                const porcentaje = (t.cantidad / t.cantidadIdeal) * 100
                return porcentaje < 80
            }).map(t => ({
                _id: t._id,
                marca: t.marca,
                toner: t.toner,
                cantidadActual: t.cantidad,
                cantidadIdeal: t.cantidadIdeal,
                porcentaje: ((t.cantidad / t.cantidadIdeal) * 100).toFixed(2) + "%",
                faltante: Math.max(t.cantidadIdeal - t.cantidad, 0)
              }));

        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tóners con poco stock", error });
    }
}

