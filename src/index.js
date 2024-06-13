import app from "./app.js"
import  connectDB  from "./db.js"
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3500

connectDB()
app.listen(port, () => {
    console.log(`servidor en el puerto ${port}`)
  })
