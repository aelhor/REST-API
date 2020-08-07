const express = require('express')
const router =express.Router()
const userController = require('../controllers/users')


/// Create a New User
router.post('/signup',userController.user_signUp)

/// User Loging
router.post('/login', userController.user_logIn)

router.delete('/:id', userController.user_delete)

router.get('/', userController.get_all_users)


module.exports = router