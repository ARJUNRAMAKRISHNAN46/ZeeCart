const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const router = require('./router.js/userrouter');
const mongoose=require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

app.use(express.urlencoded({extended : true}));

app.use(express.json());

app.set('view engine','ejs');

app.use(
    session({
        secret : 'secret',
        resave : false, 
        saveUninitialized : true
    })
)

app.use(express.static('public'));

app.use('/',router);

app.use(passport.initialize())

require('./authenticate');

app.get('/google',passport.authenticate('google',{scope : ['profile','email']}));

app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/login'}),(req,res)=>{
    res.end('Logged in!');
})

mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(4000,()=>{
    console.log('server running in http://localhost:4000');
}))

