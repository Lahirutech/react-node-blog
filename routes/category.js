const express = require('express')
const router = express.Router();
const { create, list, read, remove } = require('../controllers/categoryController');
const { userAuth, checkRoleAdmin } = require('../controllers/auth')

router.post('/create', userAuth, checkRoleAdmin, create)
router.get('/list', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', userAuth, checkRoleAdmin, remove);





module.exports = router;