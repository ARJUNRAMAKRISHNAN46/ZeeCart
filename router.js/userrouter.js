const express = require('express');
const router=express.Router()
const bcrypt = require('bcrypt');
const {
    Login,
    signup,
    userLogtoSign,
    userSigntoLog,
    demo,
} = require('../controllers/user-controller');
const UserSchema = require('../models/model');
const { render } = require('ejs');
const passport = require('passport');
const nodemailer = require('nodemailer');

const credential = {
    email : "abcd@gmail.com",
    password : 123
}
router.get('/',(req,res)=>{
    if(req.session.userlogged){
        res.render('users/home');
    }
    else{
        res.render('user/login',{title : 'user login page'});
    }
})
router.route('/home').get(userSigntoLog).post(userLogin)
router.route('/signup').get(userLogtoSign).post(signup)
router.get('/user/demo',demo)
router.get('/google',passport.authenticate('google',{scope : ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/login'}),(req,res)=>{
    res.render('/home',{});
})


module.exports = router