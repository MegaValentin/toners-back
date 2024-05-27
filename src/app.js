import express from 'express'
import morgan from 'morgan';
import officesRouter from './routes/areas.routes.js';
import tonersRoutes from './routes/toners.routes.js';
import ordersRoutes from './routes/orders.routes.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use('/api',officesRouter)
app.use('/api',tonersRoutes)
app.use('/api', ordersRoutes)



export default app