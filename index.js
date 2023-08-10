const express = require('express')
const bodyParser = require("body-parser")
const env = require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: true }))
const userRoute = require('./routes/userRoutes')
const mongoose = require('mongoose')

 mongoose.connect(env.MONGODB_URI)
 
 app.use('/',userRoute.userRoute)

app.listen(3000,()=>console.log("server is running on http://localhost:3000/"))