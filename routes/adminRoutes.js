const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');
const favoriteController = require('../controllers/favorite');

// Protected routes – require auth
router.get('/myProperties', isAuth, propertyController.getMyProperties);
router.get('/create', isAuth, propertyController.getCreateProperty);
router.post('/create', isAuth, propertyController.createProperty);
router.get('/update/:id', isAuth, propertyController.getEditProperty);
router.put('/update/:id', isAuth, propertyController.updateProperty);
router.delete('/delete/:id', isAuth, propertyController.deleteProperty);

router.get('/fav', isAuth, favoriteController.getFavorites);
router.post('/add/:propertyId', isAuth, favoriteController.addToFavorite);
router.delete('/remove/:propertyId', isAuth, favoriteController.removeFromFavorite);

module.exports = router;
