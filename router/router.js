const express = require('express');
const router = express.Router();
const Items = require('../controller/items');


router.post('/items',Items.createItem);
router.get('/items',Items.getAllItems);
router.put('/items',Items.updateItem);
router.delete('/clearitems',Items.clearAllItems);



module.exports = router