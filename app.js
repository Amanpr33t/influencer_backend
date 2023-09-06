const express = require('express')
const app = express()
//app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const connectDB = require('./db/connectDB')
const port = 3011
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
require('dotenv').config()
const notFound = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware')
//const helmet = require('helmet')
//const xss = require('xss-clean')
//const mongoSanitize = require('express-mongo-sanitize')
const influencerRouter = require('./routes/influencerRouter')

//app.set('trust proxy', 1)
//app.use(helmet())
const cors = require('cors');
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    next()
})
//app.use(xss())
//app.use(mongoSanitize())

app.use('/influencer', influencerRouter)
app.use(notFound)
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server running on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start()


