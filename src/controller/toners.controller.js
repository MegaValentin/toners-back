import Toners from "../models/toners.model.js"

export const getToners = async (req, res) =>{
    try{
        const toners = await Toners.find()
        res.json(toners)

    }catch(error){
        return res.status(500).json({message:"error al buscar las Areas"})
    }
}

export const getToner = async (req, res) =>{
    try {  
        const {id} = req.params
        const toner = await Toners.findById(id)

        if(!toner) {
            return res.status(404).json({
                message: "Toner no encontrada"
            })
        }

        res.json(toner)
        
    } catch (error) {
        console.error('Error al obtener el toner:', error);
        res.status(500).json({
            message:"Error al obtener el toner"
        })
    }
}

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

export const updatedToner = async (req, res) =>{
    try {
        const { id } = req.params
        const { toner, cantidad} = req.body
        
        if(!toner && cantidad === undefined){
            return res.status(400).json({
                message:"El campor 'toner' y 'cantidad' son requeridos"
            })
        }

        const updatedToner = await Toners.findByIdAndUpdate(id, req.body, {new: true})

        if(!updatedToner){
            return res.status(404).json({
                message:"Toner no encontrado"
            })
        }

        res.json(updatedToner)
    } catch (error) {
        console.error('Error al actualizar el toner:', error);
        res.status(500).json({
            message:"Error al actulizar el toner"
        })
    }
}

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