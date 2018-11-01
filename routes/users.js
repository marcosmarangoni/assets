const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users/create', {anyArray: [1, 2, 3], condition: false});
});
router.get('/create', userController.create_user);
router.get('/read/:id', userController.read_user);
router.get('/update/:id', userController.update_user);
router.get('/remove/:id', userController.remove_user);

module.exports = router;
