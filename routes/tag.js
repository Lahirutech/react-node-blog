const express = require('express')
const router = express.Router();

const { create, list, read, remove } = require('../controllers/tagController');
const { userAuth, checkRoleAdmin } = require('../controllers/auth');



router.post('/create', userAuth, checkRoleAdmin, create);
router.get('/list', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', userAuth, checkRoleAdmin, remove);

module.exports = router;
