const express = require('express');
const router = express.Router();
const browse = require('../controllers/browse');
const filter = require('../controllers/filter');
const isAuth = require('../middlewares/isAuth');


// GET requests – no auth required
router.get('/filter',isAuth, filter.filterProperties);
router.get('/filterPage',isAuth, filter.getfilter);
router.get('/',isAuth, browse.getAllProperties);
router.get('/:id',isAuth, browse.getPropertyById); // Keep this last


module.exports = router;
