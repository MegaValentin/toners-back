import TodoList from  "../models/todolist.model.js"

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
export const addTask = async (req, res) => {}
export const updatedTask = async (req, res) => {}
export const deleteTask = async (req, res) => {}
