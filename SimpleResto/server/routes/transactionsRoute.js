const express = require('express')
const Controller = require('../controllers/controller')
const authentication = require('../middlewares/authentication')
const adminAuthorization = require('../middlewares/authorization')
const router = express.Router()

router.get('/orders', authentication, Controller.showOrders)
router.post('/ordersPayment/:id', authentication, Controller.orderAndPayment)



module.exports = router