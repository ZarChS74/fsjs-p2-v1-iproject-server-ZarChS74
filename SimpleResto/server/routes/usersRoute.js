const express = require('express')
const Controller = require('../controllers/controller')
const authentication = require('../middlewares/authentication')
const adminAuthorization = require('../middlewares/authorization')
const router = express.Router()


router.post('/register', Controller.userRegister)
router.post('/login', Controller.userLogin)
router.get('/', authentication, Controller.showUsers)
router.get('/:id', authentication, adminAuthorization, Controller.showUsersById)

module.exports = router