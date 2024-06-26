import {z} from 'zod'

export const resgisterSchema  = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(4,{
        message:'La contraseña debe ser por lo menos de 4 caracteres'
    })
})


export const loginSchema = z.object({
    username: z.string({
        required_error:'Email is required'
    }),
    password: z.string({
        required_error:' Password is required'
    }).min(4, {
        message: "la contraseña debe ser por lo menos de 4 caracteres"
    })
})