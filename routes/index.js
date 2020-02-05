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
router.get('/api/assets/queryquote', userController.authenticate ,assetController.getSearchQuotes);
router.get('/api/assets', userController.authenticate ,assetController.getAllAssets);
router.get('/api/assets/:asset', userController.authenticate, assetController.getAssetById);
router.post('/api/assets', userController.authenticate, assetController.newAsset);
router.post('/api/assets/movement', userController.authenticate, assetController.newMovement);
router.put('/api/assets', userController.authenticate, assetController.editAsset);
router.put('/api/assets/movement', userController.authenticate, assetController.editMovement);
/****************************************/

/******** API Goals Routes *************/
router.get( '/goals/', userController.authenticate, goalController.index);
router.post('/goals/', userController.authenticate, goalController.indexList);
router.post('/goals/create', userController.authenticate, goalController.createGoal);
router.get( '/goals/:goalID', userController.authenticate, goalController.ShowGoal);
router.post('/goals/:goalID', userController.authenticate, goalController.ShowGoalData);
router.get('/goalsDEBUG/:goalID', userController.authenticate, goalController.ShowGoalData);
/****************************************/

router.get('/refresh_quotes', assetController.refreshQuotes);

router.get('/seed', async (req,res) => {
    try {
        let andre = new User();
        andre.first_name = 'Andre';
        andre.last_name = 'Sa';
        andre.username = 'andre3@s.com';
        andre.password = 'teste1234';
        await andre.save();
    
        let movs = [{
            date:'2017-01-01',
            mov_id: mongoose.Types.ObjectId(),
            kind:'c',
            value:-15000 },
            {
            date:'2017-01-01',
            mov_id: mongoose.Types.ObjectId(),
            kind:'d',
            value: 15 }];

        let wmt = new Asset();
        wmt.code = 'WMT';
        wmt.user_id = andre.id;
        wmt.movements = movs;
        await wmt.save();
        res.send(wmt);    
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
    
});

module.exports = router;