const express = require('express');
const routers = express.Router();
const controller = require('../controllers/admin-controller');
const UserSchema = require('../models/model')

// routers.get('/admin/user',controller.adminUserControl);
routers.get('/customers',controller.admin_Users);
routers.get('/brands',controller.admin_brands);
routers.get('/catagory',controller.admin_catagory);


module.exports = routers