const env = require('dotenv').config()

const sessionSecret =  env.SESSION_SECRET

module.exports ={
    sessionSecret
}