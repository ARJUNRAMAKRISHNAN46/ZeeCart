const express = require('express');
const router = express.Router();
const session = require('express-session')
const userModel = require('../models/model')
const bcrypt = require('bcrypt');
const passport = require('passport');
const { hashData,
verifyHashedData } = require('../util/hashData');

//user login to home page
async function Login(req,res){
    try {
        const { email,password } = req.body;
        email = email.trim();
        password = password.trim();

        if(!(email,password)){
            throw Error('Empty credentials supplied !');
        }
    } catch (error) {
        
    }
    const connect = await userModel.findOne({email : email});

    const pass = await bcrypt.compare(password,connect.password);

    if(connect.email == req.body.email){
        if(password == connect.password){
            res.render('user/home',{title : 'user home page'})
        }else{
            throw Error('Invalid password');
        }
    }else{
        throw Error('User not found');
    }
}

const authenticateUser = async (authData) => {
    try {
        const { email,password } = authData;
        const fetchedUser = await userModel.findOne({ email });

        if(!fetchedUser){
            throw Error('Invalid credential entered');
        }
        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password,hashedPassword);

        if(!passwordMatch){
            throw Error('Invalid password entered!');
        }
    //create user token
    

    } catch (error) {
        
    }
}

const createNewUser = async(data) => {
    try {
        const { name, email, password } = data;
        //checking if user already exists
        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            throw Error('User with the provided email already exists');
        }
        //hash password
        const hashedPassword = await hashData(password);
        const newUser = new User ({
            name,
            email,
            password : hashedPassword
        });

        const createdUser = await newUser.save();
        return createdUser;

    } catch (error) {
        
    }
}
//user sign up to home page

async function signup(req,res){
    try {
        const{name,email,password} = req.body;
        //removin the white space in name email and password
        name = name.trim();
        email = email.trim();
        password = password.trim();
    
        if(!(name && email && password)){
            throw Error('Empty input fields!');
        }else if(!/^[a-zA-Z ]*$/.test(name)){
            throw Error('Invalid name entered');
        }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            throw Error('Invalid email entered');
        }else if(password.length < 8){
            throw Error('Password is too short!');
        }else{
            const newUser = await createNewUser({
                name,
                email,
                password
            })
            res.status(200).json(newUser);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }

    // const hash= await bcrypt.hash(password,10)
    const connect = await userModel.create({name:name,email:email,password:hash})

    req.session.user = email;
    req.session.userlogged = true;
    res.render('user/home',{title : 'user login page'});
}
//user login page to signpage
function userLogtoSign(req,res){
    res.render('user/signup',{title : 'user signing page'})
}

//user sign page to login page
function userSigntoLog(req,res){
    res.redirect('/');
}


function demo(req,res){
    res.render('user/demo');
}


module.exports = {
    Login,
    signup,
    userLogtoSign,
    userSigntoLog,
    demo,
    
}
