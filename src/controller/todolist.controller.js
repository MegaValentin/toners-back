import TodoList from  "../models/todolist.model.js"
import User from '../models/users.model.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await TodoList.find()
        res.json(tasks)
    } catch (error) {
        return res.status(500).json({message:"error al buscar las tareas"})
    }
}
export const getTask = async (req, res) => {
    try {
        const {id} = req.params
        const task = await TodoList.findById(id)

        if(!task){
            return res.status(404).json({
                message: "Tarea no encontrada"
            })
        }
        res.json(task)
    } catch (error) {
        console.error("Error al obtener la tarea: ", error)
        res.status(500).json({
            message:"Error al obtener la tarea"
        })
    }
}
export const addTask = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body

        const nuevaTarea = new TodoList({
            titulo,
            descripcion,
            usuarioAsignado: null,
            estado: "pendiente"
        })

        const tareaGuardada = await nuevaTarea.save()
        res.status(201).json(tareaGuardada)

    } catch (error) {
        res.status(500).json({error: error.message})
    }

}
export const assignTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        
        console.log("Username recibido:", username);
        
        const userLoggedIn = req.user;

        if (!userLoggedIn || (userLoggedIn.role !== 'admin' && userLoggedIn.role !== 'superadmin')) {
            return res.status(403).json({ error: "Permiso denegado. El usuario debe ser 'admin' o 'superadmin'" });
        }

        
        const usuario = await User.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ error: "Usuario al que se va a asignar no encontrado" });
        }
        
        // Asignamos la tarea al usuario especificado en el body
        const task = await TodoList.findByIdAndUpdate(
            id,
            { usuarioAsignado: username, estado: "en proceso" },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        res.json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await TodoList.findByIdAndDelete(req.params.id)
        
        if(!deleteTask) return res.status(404).json({
            message: "Tarea no encontrada"
        })
        res.json({
            message:"Tarea eliminada exitosamente",
            deleteTask
        })

    } catch (error) {
        console.error('Error al eliminar la tarea:', error)
        res.status(500).json({
            message:"Error al eliminar la tarea"
        })
    }
}
