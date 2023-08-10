const express = require('express')
const fileUpload = require('express-fileupload');
const controller = require('../controllers/userController')

const userRoute = express()

const session = require('express-session')
const config = require('../config/config')
userRoute.use(session({secret: config.sessionSecret,
resave: true,
saveUninitialized: true}))

const {isLogin,isLogout} = require('../midleware/auth')

userRoute.set('views','./views')
userRoute.set('view engine', 'ejs')

userRoute.use(fileUpload());

userRoute.get('/home',isLogin,controller.home)
userRoute.get('/signin',controller.getData)
userRoute.post('/signin',controller.sendData)
userRoute.get('/login',isLogout,controller.getlogin)
userRoute.post('/login',controller.login)
// DataBase API
userRoute.get('/users',controller.getUser)
userRoute.get('/writeblog', controller.writeblog)
userRoute.post('/writeblog', controller.addblog)

module.exports = {
userRoute
}