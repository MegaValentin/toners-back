import z from 'zod'

export const createOrderSchema = ({
    toner: z.string({
        required_error:"El ID del toner es requerido"
    }),
    cantidad: z.number({
        required_error:"La cantidad es requerida"
    }),
    area: z.string({
        required_error:"El ID del area es requerido"
    })
})