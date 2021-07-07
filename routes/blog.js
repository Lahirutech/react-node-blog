const express = require('express')
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, read, remove, update } = require('../controllers/blogController');
const { userAuth, checkRoleAdmin } = require('../controllers/auth')

router.post('/create', userAuth, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', userAuth, remove);
router.put('/blig/:slug', userAuth, update);

module.exports = router;
