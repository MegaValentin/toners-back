import express from 'express'
import morgan from 'morgan';
import officesRouter from './routes/areas.routes.js';
import tonersRoutes from './routes/toners.routes.js';
import ordersRoutes from './routes/orders.routes.js'
import stockIdealRoutes from './routes/stockIdeal.routes.js'
import cors from 'cors'
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.REACT_URL,
    credentials:true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use('/api',officesRouter)
app.use('/api',tonersRoutes)
app.use('/api', ordersRoutes)
app.use('/api', stockIdealRoutes)



export default app