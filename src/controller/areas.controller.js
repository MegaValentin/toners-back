import Areas from "../models/areas.model.js"
import xlsx from 'xlsx';
import fs from 'fs';

export const getOffices = async (req, res) =>{
    try{
        const offices = await Areas.find()
        res.json(offices)

    }catch(error){
        return res.status(500).json({message:"error al buscar las Areas"})
    }
}

export const getOffice = async (req, res) =>{
    try {  
        const {id} = req.params
        const office = await Areas.findById(id)

        if(!office) {
            return res.status(404).json({
                message: "Area no encontrada"
            })
        }

        res.json(office)
        
    } catch (error) {
        console.error('Error al obtener el area:', error);
        res.status(500).json({
            message:"Error al obtener el area"
        })
    }
}

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

export const updatedOffice = async (req, res) =>{
    try {

        const { area } = req.body;
    
        if (!area) {
        return res.status(400).json({
            message: "El campo 'area' es requerido"
        });
        }

        const office =  await Areas.findByIdAndUpdate(req.params.id, { area }, {
            new:true
        })
        
        if(!office){
            return res.status(404).json({
                message: "Area no encontrada"
            })
        }

        res.json(office)
    } catch (error) {
        console.error('Error al actualizar el area:', error);
        res.status(500).json({
            message:"Error al actualizar el area"
        })
    }
}

export const addOffice = async (req, res) => {
    try {
        const { area } = req.body;

        if (area === undefined || area.trim() === '') {
            return res.status(400).json({ message: 'El nombre del área es requerido' });
        }

        const normalizedOffice = area.trim().toLowerCase();
        const existingOffice = await Areas.findOne({ area: { $regex: `^${normalizedOffice}$`, $options: 'i' } });

        if (existingOffice) {
            return res.status(400).json({ message: "Ya hay un área con este nombre" });
        } else {
            const newOffice = new Areas({ area: normalizedOffice });
            const savedOffice = await newOffice.save();
            return res.status(201).json(savedOffice);
        }
    } catch (error) {
        console.error('Error al agregar el área', error);
        return res.status(500).json({ message: 'Error al agregar el área.' });
    }
};


export const addAllOfiice = async (req, res) => {
    const file = req.file

    console.log(file)

    if(!file){
        return res.status(400).json({error: "No file upload"})
    }

    try {
        const officebook = xlsx.readFile(file.path)
        const sheetName = officebook.SheetNames[0]
        const worksheet = officebook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet)
        console.log(data)
        const newOffice = data.map((row) => ({
            area:row.Area,
        }))

        await Areas.insertMany(newOffice)
        fs.unlinkSync(file.path)

        res.status(200).json({message: 'Arear agregadas correctamente'})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}