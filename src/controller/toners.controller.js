import Toners from "../models/toners.model.js"

export const getToners = async (req, res) =>{
    try{
        const toners = await Toners.find()
        res.json(toners)

    }catch(error){
        return res.status(500).json({message:"error al buscar las Areas"})
    }
}

export const getToner = async (req, res) =>{}

export const deleteToner = async (req, res) =>{
    try{
        
        const deleteToner = await Toners.findByIdAndDelete(req.params.id)
        if(!deleteToner) return res.status(404).json({
            message:"Toner no encontrada"
        })
        res.json({
            message: "Toner eliminada exitosamente",
            deleteToner
        })
   
    }catch(error){
        console.error('Error al eliminar el toner:',error)
        res.status(500).json({
            message:"Error al eliminar el toner"
        })
    }
}

export const updateToner = async (req, res) =>{}

export const addToners = async (req, res) =>{
    
    try{
        const { toner, cantidad } = req.body;
        
        if(!toner || cantidad === undefined){
            return res.status(400).json({message: 'El nombre y la cantidad son requeridos'})
        }

        const newToner = new Toners({toner, cantidad})
        const savedToner = await newToner.save()

        res.status(201).json(savedToner)

    } catch(error){
        console.log('Error al agregar el toner', error)
        res.status(500).json({message:'Error al agregar el toner.'})
    }
}