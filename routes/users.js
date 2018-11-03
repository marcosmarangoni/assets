const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET */
router.get('/', (req, res) => res.redirect('/users/create'));
router.get('/create', userController.create);
router.get('/read/:id', userController.readUser);
router.get('/update/:id', userController.updateUser);
router.get('/remove/:id', userController.removeUser);
router.get('/list', userController.list);

/* POST */
router.post('/create_user', userController.createUser, userController.create);
router.post('/list_users', userController.listUsers);

module.exports = router;
