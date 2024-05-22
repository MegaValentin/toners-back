import Areas from "../models/areas.model.js"

export const getOffices = async (req, res) =>{
    try{
        const offices = await Areas.find()
        res.json(offices)

    }catch(error){
        return res.status(500).json({message:"error al buscar las Areas"})
    }
}

export const getOffice = async (req, res) =>{}

export const deleteOffice = async (req, res) =>{
    try{
        
        const deleteOffice = await Areas.findByIdAndDelete(req.params.id)
        if(!deleteOffice) return res.status(404).json({
            message:"Area no encontrada"
        })
        res.json({
            message: "Area eliminada exitosamente",
            deleteOffice
        })
   
    }catch(error){
        console.error('Error al eliminar el area:',error)
        res.status(500).json({
            message:"Error al eliminar el area"
        })
    }
}

export const updateOffice = async (req, res) =>{}

export const addOffice = async (req, res) =>{
    try{
        const { area } = req.body;
        
        if(!area=== undefined){
            return res.status(400).json({message: 'El nombre del area es requerido'})
        }

        const newOffice = new Areas({area})
        const savedOffice = await newOffice.save()

        res.status(201).json(savedOffice)

    } catch(error){
        console.log('Error al agregar la area', error)
        res.status(500).json({message:'Error al agregar la area.'})
    }
}