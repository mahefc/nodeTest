const express = require('express');
const router = express.Router();
const Items = require('../controller/items');
const User = require('../controller/user');
const Service = require('../service/common');


router.post('/items',Items.createItem);
router.get('/items',Items.getAllItems);
router.put('/items',Items.updateItem);
router.delete('/clearitems',Items.clearAllItems);


router.post('/user/register',User.registerUser);
router.post('/user/login',User.loginUser);

router.use(Service.verifyToken);

router.get('/user/:id',User.getUserById);
router.get('/users',User.getAllUsers);
// router.delete('/user/:id',Items.clearAllItems);



module.exports = router