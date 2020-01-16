const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const userController = require('../controllers/userController');
const ativoController = require('../controllers/ativoController');
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
router.get( '/ativos', ativoController.index);
router.get('/api/ativos', ativoController.indexList);
router.get( '/ativos/create', ativoController.create);
router.post('/ativos/create', ativoController.createAtivo);
router.post('/ativos/newtrade', ativoController.createTrade);
router.post('/ativos/edit', ativoController.editAtivo);
router.post('/ativos/edittrade', ativoController.editTrade);
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