const path = require('path')
const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel')

const getData = async (req, res) => {
    res.render('signin')
}

const getlogin = (req, res) => {
    res.render('login')
}

const home = async(req, res) => {
    const userData = await UserModel.findOne({_id : req.session.user_id})
    res.render('main',{
        data : userData
    })
}

const securePassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        return hashPassword
    } catch (error) {
        console.log(error);
    }
}
const sendData = async (req, res) => {
    try {
        const sampleFile = req.files.file;
        const uploadPath = path.join(__dirname, '../public/userImages/', sampleFile.name);
        await sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
        });
        const sPassword = await securePassword(req.body.password)
        const user = await new UserModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.files.file.name,
            password: sPassword,
            isAdmin: 0,
            blogs:[]
        })
        await user.save();
        res.redirect("/home")

    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    const { email, password } = await req.body
    const user = await UserModel.findOne({ email: email })
    if (user) {
        const comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword) {
            req.session.user_id = user._id
          return res.redirect('/home')
        }
        else{
           return res.render('login',{
                message:"Something went wrong"
            })
        }
       
    }
    else{
        return res.render('login',{
            message:"Please SignIn,Your Email is not registerd"
        })
    }
}

const getUser = async (req, res) => {
    const users = await UserModel.find({})
    res.json(users)
}

const writeblog = (req,res)=>{
res.render('writeBlog')
} 

const addblog = async(req,res)=>{
    try {
        const sampleFile = req.files.image;
        const uploadPath = path.join(__dirname, '../public/userImages/', sampleFile.name);
        await sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
        });

        const {title,body} = req.body
    
        const userData = await UserModel.updateOne({_id : req.session.user_id},{ $push:{
            blogs:{
             image: req.files.image.name,
             title:title,
             body:body
            }
        }}) 
        if (userData) {
            res.redirect('/home')
        }
        else{
            console.log('Error');
        }
    } catch (error) {
        console.log(error);
    }
} 
module.exports = {
    home,
    sendData,
    getData,
    login,
    getlogin,
    getUser,
    writeblog,
    addblog
}