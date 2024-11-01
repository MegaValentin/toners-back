import UnidadImagen from "../models/unidadImagen.model.js"
import xlsx from 'xlsx';
import fs from 'fs';
import excelJS from 'exceljs';

export const getUnidadImagen = async(req,res) => {
    try {
        const unis = await UnidadImagen.find()
        res.json(unis)
    } catch (error) {
        return res.status(500).json({message: "Error al buscar la unidad de imagen"})
    }
}

export const getUni = async (req, res) => {
    try {
        const {id} = req.params
        const  uni = await UnidadImagen.findById(id)

        if(!uni){
            return res.status(404).json({
                message: "Unidad de imagen no encontrada"
            })
        }
        res.json(uni)

    } catch (error) {
        console.error('Error al obtener la unidad de imagen: ', error)
        res.status(500).json({
            message:"Error al obtener la unidad de imagen"
        })
    }
}

export const addUni = async (req, res) => {
    try {
        const {unidadImagen, cantidad, marca} = req.body

        if(!unidadImagen || !marca || cantidad === undefined) {
            return res.status(400).json({message:'Es necesario completar todos los campos'})
        }

        const normalizedUni = unidadImagen.trim().toLowerCase()
        const existingUni = await UnidadImagen.findOne({unidadImage: { $regex: `^${normalizedUni}$`, $options: 'i' }})

        if(existingUni){
            existingUni.cantidad += cantidad
            const updatedUni = await existingUni.save()
            res.status(200).json(updatedUni)
        }else{
            const newUni = new UnidadImagen({marca, unidadImagen, cantidad})
            const savedUni = await newUni.save()
            res.status(201).json(savedUni)
        }
    } catch (error) {
        console.log('Error al agregar la unidad de imagen', error)
        res.status(500).json({message: 'Error al agregar la unidad de imagen'})
    }
}

export const deleteUni = async (req, res) => {
    try {
        const deleteUnidadImagen = await UnidadImagen.findByIdAndDelete(req.params.id)
        if(!deleteUnidadImagen) return res.status(404).json({
            message:"Unidad de Imagen no encontrada"
        })
        res.json({
            message:"Unidad de imagen eliminada exitosamente", deleteUnidadImagen
        })
    } catch (error) {
        console.error('Error al eliminar la unidad de imagen', error)
        res.status(500).json({
            message:"Error al eliminar el toner"
        })
    }
}

export const updatedUni = async (req, res) => {
    try {
        const {id} = req.params
        const {marca, cantidad, unidadImagen} = req.body

        if(!unidadImagen && cantidad === undefined && !marca){
            return res.status(400).json({
                message:"El campo 'unidad de image' y 'cantidad' son requeridos"
            })
        }
        
        const updatedUni = await UnidadImagen.findByIdAndUpdate(id, req.body, { new: true })

        if(!updatedUni){
            return res.status(404).json({
                message: "Unidad de imagen no encontrada"
            })
        }

        res.json(updatedUni)
    } catch (error) {
        console.error("Error al actualizar la unidad de imagen: ", error)
        res.status(500).json({
            message: "Error al actualizar la unidad de imagen"
        })
    }
}

export const reportUni = async (req, res) => {
    try {
        const unis = await UnidadImagen.find()

        if(!unis || unis.length === 0){
            return res.status(404).json({message:"No uni data available"})
        }

        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet('Current Stock Report')
        
        worksheet.colums = [
            {header: 'Marca', key:'marca', width:25},
            {header: 'Unidad de imagen', key:'unidadImagen', width:25},
            {header: 'Cantidad', key:'cantidad', width:25},
        ]

        unis.forEach((uni) => {
            worksheet.addRow({
                marca:uni.marca,
                uni: uni.unidadImagen,
                cantidad: uni.cantidad
            })
        })

        // Configurar el archivo para su descarga
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        
        res.setHeader('Content-Disposition', 'attachment; filename=current_stock_report.xlsx');
            
        await workbook.xlsx.write(res)
        res.status(200).end()
    } catch (error) {
        console.error('Error generating current stock report: ', error)
        res.status(500).json({message:'Error generating current stock report' })
    }
}