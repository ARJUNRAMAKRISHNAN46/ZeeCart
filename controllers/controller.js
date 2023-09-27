const express = require('express');
const router = express.Router();
const session = require('express-session')
const userModel = require('../models/model')
const bcrypt = require('bcrypt');
 
const img = [{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
},
{
    url:'/iphone13.png',
    title:'IPHONE 13'
} 
]
const banner = {
    url : '/bannerrelme.png',
    title : 'realme C53 | From ₹10,999* First Sale on 20th Sept , 12PM Now Available in 6GB | 128GB 108MP Champion Like Never Before'
}
//user login to home page
async function userLogin(req,res){
    const{email,password} = req.body;
    const connect = await userModel.findOne({email : email});

    const pass = await bcrypt.compare(password,connect.password);

    if(connect.email == req.body.email){
        if(password == connect.password){
            res.render('user/userhome',{title : 'user home page',img,banner})
        }else{
            // res.render('userlogin',{err : 'Invalid password'})
            throw Error('Invalid password');
        }
    }else{
        // res.render('userlogin',{err : 'User name not found'})
        throw Error('User not found');
    }
}
//user sign up to home page

async function userSignup(req,res){
    const{name,email,password} = req.body;
    // const salt= await bcrypt.genSalt(10)
    // console.log(password);
    const hash= await bcrypt.hash(password,10)
    const connect = await userModel.create({name:name,email:email,password:hash})
    // res.status(201).send(connect)

    req.session.user = email;
    req.session.userlogged = true;
    res.render('user/userhome',{title : 'user login page',img,banner});
}
//user login page to signpage
function userLogtoSign(req,res){
    res.render('user/usersign',{title : 'user signing page'})
}

//user sign page to login page
function userSigntoLog(req,res){
    res.redirect('/');
}

module.exports = {
    userLogin,
    userSignup,
    userLogtoSign,
    userSigntoLog
}