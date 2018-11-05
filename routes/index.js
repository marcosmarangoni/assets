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
router.get('/ativos', ativoController.index);
router.get('/ativos/create', ativoController.create);
router.post('/ativos/create', ativoController.createAtivo);

module.exports = router;



/* res.render('ativos/index', { title: 'Express' }  */