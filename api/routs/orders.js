const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check_auth')
const orderControllers = require('../controllers/orders')


// Get all orders
router.get('/', checkAuth, orderControllers.get_all_ordres)

// Get a spacific orders 
router.get('/:id', checkAuth,orderControllers.get_an_order ) 

// post new order
router.post('/', checkAuth, orderControllers.post_an_order) 

// Delete a Post 
router.delete('/:id', checkAuth,orderControllers.delete_an_order)

module.exports = router