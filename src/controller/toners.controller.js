import Toners from "../models/toners.model.js"
import xlsx from 'xlsx';
import fs from 'fs';

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

export const getLowToner = async (req,res) => {
    try {
        const lowToner = await Toners.find({cantidad: {$lte:2}})
        res.status(200).json(lowToner)

    } catch (error) {
        console.error('Error fetching low toner: ', error);
        res.status(500).json({message: 'Error fetchin low toner'})
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
        const { toner, cantidad } = req.body

        if (!toner && cantidad === undefined) {
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
        const { toner, cantidad } = req.body;

        if (!toner || cantidad === undefined) {
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
            const newToner = new Toners({ toner, cantidad })
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