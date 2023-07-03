const express = require('express')
const router = express.Router()
const { createUser, loginUser, updateUser, deleteUser,getUser,followUser,unfollowUser,verifyUser, forgetpassword, restpassword, resetuserpassword } = require('../controllers/User')




router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unfollowUser)
router.get("/verify/:id", verifyUser)
router.post("/forgetpassword",forgetpassword)
router.get("/reset-password/:id", restpassword)
router.post("/reset-password/:userId",   resetuserpassword)


module.exports = router;