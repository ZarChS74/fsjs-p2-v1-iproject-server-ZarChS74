const express = require('express')
const Controller = require('../controllers/controller')
const authentication = require('../middlewares/authentication')
const adminAuthorization = require('../middlewares/authorization')
const router = express.Router()


router.get('/', authentication, Controller.showMenus)
router.get('/:id', authentication, Controller.showMenusById)


module.exports = router