import z from 'zod'

export const createAreaSchema = z.object({
    area: z.string({
        required_error : "El nombre del area es requerido"
    })
})