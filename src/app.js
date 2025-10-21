import express from 'express'
import morgan from 'morgan';

import officesRouter from './routes/areas.routes.js';
import tonersRoutes from './routes/toners.routes.js';
import ordersRoutes from './routes/orders.routes.js'
import usersRouters from './routes/users.routes.js'
import todolistRoutes from './routes/todolist.routes.js' 
import unidadImagenRoutes from './routes/unidadImagen.router.js';
import hardwareRoutes from './routes/hardware.routes.js'
import printRoutes from './routes/print.routes.js'

import cors from 'cors'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import secureRouter from './routes/secure.routes.js'
dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.REACT_URL_DES,
    credentials:true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', usersRouters)
app.use('/api',secureRouter)
app.use('/api',officesRouter)
app.use('/api',tonersRoutes)
app.use('/api', ordersRoutes)
app.use('/api', todolistRoutes)
app.use('/api', unidadImagenRoutes)
app.use('/api', hardwareRoutes)
app.use('/api', printRoutes)



export default app