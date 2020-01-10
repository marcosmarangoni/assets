const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home/index', { title: 'Express' });
});
router.get('/form', function (req, res) {
    res.render('home/form');
});

var ativoController = require('../controllers/ativoController');
router.get( '/ativos', ativoController.index);
router.get('/api/ativos', ativoController.indexList);

router.get( '/ativos/create', ativoController.create);
router.post('/ativos/create', ativoController.createAtivo);

router.post('/ativos/newtrade', ativoController.createTrade);
router.post('/ativos/edit', ativoController.editAtivo);
router.post('/ativos/edittrade', ativoController.editTrade);

var goalController = require('../controllers/goalController');
router.get( '/goals/', goalController.index);
router.post('/goals/', goalController.indexList);
router.post('/goals/create', goalController.createGoal);
router.get( '/goals/:goalID', goalController.ShowGoal);
router.post('/goals/:goalID', goalController.ShowGoalData);
router.get('/goalsDEBUG/:goalID', goalController.ShowGoalData);
module.exports = router;



/* res.render('ativos/index', { title: 'Express' }  */