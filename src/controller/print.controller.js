import Print from "../models/print.model.js"
import Toners from "../models/toners.model.js"


export const getPrints = async(req, res) => {
    try{
        const prints = await Print.find()
        res.json(prints)
    } catch(error){
        return res.status(500).json({ message: "error al buscar la impresora"})
    }
}

export const getPrint = async (req, res) => {
    try {
        const { id } = req.params
        const print = await Print.findById(id).populate("toner")

        if(!print) {
            return res.status(404).json({
                message: "Impresora no encontrada"
            })
        }

        res.json(print)

    } catch (error) {
        console.error('Error al obtener la impresora: ', error)
        res.status(500).json({
            message:"Error al obtener la impresora"
        })
    }
}

export const deletePrint = async (req, res) => {
    try {
        const deletePrint = await Print.findByIdAndDelete(req.params.id)

        if(!deletePrint) return res.status(404).json({
            message: "Impresora no encontrada"
        })
        res.json({
            message: "Impresora eiminada exitosamente",
            deletePrint
        })
    } catch (error) {
        console.error('Error al obtner la impresora: ', error)
        res.status(500).json({
            message: "Error al eliminar la impresora"
        })
    }
}

export const addPrint = async (req, res) => {
    try {
        const { marca, modelo, toner } = req.body;
    
        if (!marca || !modelo || !toner) {
          return res.status(400).json({
            message: "Los campos 'modelo', 'marca' y 'toner' son obligatorios",
          });
        }
    
        const tonerExists = await Toners.findById(toner);
        if (!tonerExists) {
          return res.status(404).json({
            message: "El toner especificado no existe",
          });
        }
    
        const newPrint = new Print({
          marca,
          modelo,
          toner,
          tonerName: tonerExists.toner,
        });
    
        const savedPrint = await newPrint.save();
    
        res.status(201).json(savedPrint);
      } catch (error) {
        console.error("Error al agregar la impresora:", error);
        res.status(500).json({ message: "Error al agregar la impresora" });
      }
}

export const getListPrint = async (req, res) => {
    try {
        const {tonerId} = req.params
        const prints = await Print.find({ toner: tonerId})

        res.json(prints)
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar los impresoras en la lista"
        })
    }
}

export const updatedPrint = async (req, res) => {
    try {
        const { id } = req.params
        const { marca, modelo, toner } = req.body

        const print = await Print.findById(id)
        if(!print){
            return res.status(404).json({ message: "impresora no encontrada"})
        }


        let tonerName = print.tonerName
        if(toner){
            const tonerExists = await Toners.findById(toner)
            if(!tonerExists) {
                return res.status(404).json({ message: "El toner especificado no existe"})
            }
            tonerName = tonerExists.toner
        }

        print.marca = marca || print.marca
        print.modelo = modelo || print.modelo
        print.toner = toner || print.toner
        print.tonerName = tonerName

        const updatedPrint = await Print.save()

        res.json({
            message: "impresora actualizada exitosamente",
            updatedPrint
        })
    } catch (error) {
        console.error("Error al actualizar la impresora ", error)
        res.status(500).json({ message: "Error al actualizar la impresora"})
    }
}