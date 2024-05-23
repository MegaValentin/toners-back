import express from 'express'
import morgan from 'morgan';
import officesRouter from './routes/areas.routes.js';
import tonersRoutes from './routes/toners.routes.js';
import ordersRoutes from './routes/orders.routes.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use('/api',officesRouter)
app.use('/api',tonersRoutes)
app.use('/api', ordersRoutes)

export default app