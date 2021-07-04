const express = require('express')
const router = express.Router();
const { create } = require('../controllers/blogController');
const { userAuth, checkRoleAdmin } = require('../controllers/auth')

router.post('/create', userAuth, create)

module.exports = router;
