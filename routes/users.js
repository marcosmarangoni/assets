const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const userController = require('../controllers/userController');

/*********** Sign Up routes *************/
router.get('/', userController.signUp);
router.get('/signUp', userController.signUp);
router.post('/signUpPost', userController.signUpPost);
/****************************************/

/*********** Log In routes *************/
router.get('/logIn', userController.logIn);
// Body Parser is used here to decode the URL Encoded Body.
router.post('/logInPost', bodyParser.urlencoded({ extended: false }), userController.logInPost);
/****************************************/

router.get('/read/:id', userController.readUser);
router.get('/update/:id', userController.updateUser);
router.get('/remove/:id', userController.removeUser);

// List route
router.get('/list', userController.list);
router.post('/list_users', userController.listUsers);

module.exports = router;
