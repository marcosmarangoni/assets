const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const userController = require('../controllers/userController');
const assetController = require('../controllers/assetController');
const goalController = require('../controllers/goalController');

/*********** API User Routes *************/
router.post('/api/signup', bodyParser.urlencoded({ extended: false }), userController.signUp);
router.post('/api/login', bodyParser.urlencoded({ extended: false }), userController.logIn);
router.get('/api/users/list', userController.list);
router.get('/api/users/read/:id', userController.read);
router.put('/api/users/update/:id', userController.update);
router.delete('/api/users/remove/:id', userController.remove);
/****************************************/

/******** API Assets Routes *************/
router.get('/api/assets', assetController.getAllAssets);
router.get('/api/assets/:assetId', assetController.getAssetById);
router.post('/ativos/create', assetController.createAtivo);
router.post('/ativos/newtrade', assetController.createTrade);
router.post('/ativos/edit', assetController.editAtivo);
router.post('/ativos/edittrade', assetController.editTrade);
/****************************************/

/******** API Goals Routes *************/
router.get( '/goals/', goalController.index);
router.post('/goals/', goalController.indexList);
router.post('/goals/create', goalController.createGoal);
router.get( '/goals/:goalID', goalController.ShowGoal);
router.post('/goals/:goalID', goalController.ShowGoalData);
router.get('/goalsDEBUG/:goalID', goalController.ShowGoalData);
/****************************************/

module.exports = router;