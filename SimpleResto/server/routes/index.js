const express = require('express')
const Controller = require('../controllers/controller')
// const authentication = require('../middlewares/authentication')
// const adminAuthorization = require('../middlewares/authorization')
const router = express.Router()
const usersRoute = require('./usersRoute')
const menusRoute = require('./menusRoute')
const transactionsRoute = require('./transactionsRoute')


router.use('/users', usersRoute)
router.use('/menus', menusRoute)
router.use('/transactions', transactionsRoute)


module.exports = router

