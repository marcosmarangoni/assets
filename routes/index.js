const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home/index', { title: 'Express' });
});
router.get('/form', function (req, res) {
    res.render('home/form');
});

var assetController = require('../controllers/assetController');

router.get('/api/assets', assetController.getAllWithIRR);
router.get('/api/assets/:assetId', assetController.getAssetById);


router.post('/ativos/create', assetController.createAtivo);

router.post('/ativos/newtrade', assetController.createTrade);
router.post('/ativos/edit', assetController.editAtivo);
router.post('/ativos/edittrade', assetController.editTrade);

var goalController = require('../controllers/goalController');
router.get( '/goals/', goalController.index);
router.post('/goals/', goalController.indexList);
router.post('/goals/create', goalController.createGoal);
router.get( '/goals/:goalID', goalController.ShowGoal);
router.post('/goals/:goalID', goalController.ShowGoalData);
router.get('/goalsDEBUG/:goalID', goalController.ShowGoalData);
module.exports = router;



/* res.render('ativos/index', { title: 'Express' }  */