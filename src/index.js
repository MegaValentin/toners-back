import app from "./app.js"
import  connectDB  from "./db.js"

connectDB()
app.listen(3500)
console.log("servidor en el puerto", 3500)