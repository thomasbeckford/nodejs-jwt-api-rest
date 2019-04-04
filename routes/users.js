const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');
const userMiddleware = require('../app/api/middlewares/users');
router.post('/register',userMiddleware.exists, userController.create);
router.post('/authenticate', userController.authenticate);
module.exports = router;