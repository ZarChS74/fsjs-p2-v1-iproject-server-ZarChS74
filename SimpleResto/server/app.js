// require('dotenv').config()
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express")
const errorHandlers = require("./middlewares/errorHandlers")
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000
const router = require("./routes/index")

app.use(cors())
 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)
app.use(errorHandlers)

// console.log(process.env.SECRET_KEY)

// app.listen(PORT, () => {
//     console.log(`Connecting to PORT ${PORT}`);
// })

module.exports = {
    PORT,
    app
}