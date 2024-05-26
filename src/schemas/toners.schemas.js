import z from 'zod'

export const createTonerSchema = z.object({
    toner: z.string({
        required_error:"El nombre del toner es requerido"
    }),
    cantidad: z.number({
        required_error:"La cantidad es requrida"
    }).min(1,{
        message: "La cantidad debe ser al menos 1"
    })
})