const express = require('express')
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, photo, read, remove, update,listRelated } = require('../controllers/blogController');
const { userAuth, checkRoleAdmin } = require('../controllers/auth')

router.post('/create', userAuth, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', userAuth, remove);
router.put('/blog/:slug', userAuth, update);
router.get('/blog/photo/:slug', photo);
router.post('/blog/related', listRelated);


module.exports = router;
