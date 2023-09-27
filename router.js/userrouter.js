const express = require('express');
const router=express.Router()
const bcrypt = require('bcrypt');
const controller = require('../controllers/controller');
const UserSchema = require('../models/model')

const credential = {
    email : "abcd@gmail.com",
    password : 123
}

router.get('/',(req,res)=>{
    if(req.session.userlogged){
        res.render('userhome');
    }
    else{
        res.render('user/userlogin',{title : 'user login page'});
    }
})

router.route('/users/login')
.get(controller.userSigntoLog)
.post(controller.userLogin)

router.route('/users/signup')
.get(controller.userLogtoSign)
.post(controller.userSignup)







module.exports = router