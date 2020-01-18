const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const Asset = require('../models/asset');
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const assetController = require('../controllers/assetController');
const goalController = require('../controllers/goalController');

/*********** API User Routes *************/
router.post('/api/signup', bodyParser.urlencoded({ extended: false }), userController.signUp);
router.post('/api/login', bodyParser.urlencoded({ extended: false }), userController.logIn);
router.get('/api/users/list', userController.authenticate, userController.list);
router.get('/api/users/read/:id', userController.authenticate, userController.read);
router.put('/api/users/update/:id', userController.authenticate, userController.update);
router.delete('/api/users/remove/:id', userController.authenticate, userController.remove);
/****************************************/

/******** API Assets Routes *************/
router.get('/api/assets', userController.authenticate ,assetController.getAllAssets);
router.get('/api/assets/:assetId', userController.authenticate, assetController.getAssetById);
router.post('/ativos/create', userController.authenticate, assetController.createAtivo);
router.post('/ativos/newtrade', userController.authenticate, assetController.createTrade);
router.post('/ativos/edit', userController.authenticate, assetController.editAtivo);
router.post('/ativos/edittrade', userController.authenticate, assetController.editTrade);
/****************************************/

/******** API Goals Routes *************/
router.get( '/goals/', userController.authenticate, goalController.index);
router.post('/goals/', userController.authenticate, goalController.indexList);
router.post('/goals/create', userController.authenticate, goalController.createGoal);
router.get( '/goals/:goalID', userController.authenticate, goalController.ShowGoal);
router.post('/goals/:goalID', userController.authenticate, goalController.ShowGoalData);
router.get('/goalsDEBUG/:goalID', userController.authenticate, goalController.ShowGoalData);
/****************************************/

router.get('/seed', async (req,res) => {
    try {
        let andre = new User();
        andre.first_name = "Andre";
        andre.last_name = "Sa";
        andre.username = "andre3@s.com";
        andre.password = "teste1234";
        await andre.save();
    
        let movs = [{
            date:"2017-01-01",
            mov_id: mongoose.Types.ObjectId(),
            kind:"c",
            value:-15000},
            {
            date:"2017-01-01",
            mov_id: mongoose.Types.ObjectId(),
            kind:"d",
            value:15}];

        let wmt = new Asset();
        wmt.code = "WMT";
        wmt.user_id = andre.id;
        wmt.movements = movs;
        await wmt.save()
        res.send(wmt);    
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
    
});

module.exports = router;