const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const router = require('./routes/api')
var cors = require('cors')

app.use(cors())
//connecting to mongoose
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.DB_CONNECT, connectionParams)
    .then(() => {
        console.log("connect to DB")
    })
    .catch((err) => {
        console.log("error: " + err)
    })
   
app.use(bodyParser.json())
app.use('/', router)
app.listen(3300, () => {
    console.log("listening...")
})