//let Return = require('../services/yreturn');
const Asset = require('../models/asset.js');
let mongoose = require('mongoose');
const User = require('../models/user');

async function getAllAssets(request, response) {
    let Assets = await Asset.find({ user_id: request.user.id }).sort('code').collation({locale: "en", strength: 1});    
    AssetTotal = new Asset();
    if(request.query.irr!==undefined && request.query.irr==='1') {
        AssetTotal = new Asset();
        AssetTotal.unit = 0;
        AssetTotal.balance = 1;
        AssetTotal.sum_in = 0;
        AssetTotal.sum_out = 0;
        for(let x = 0; x < Assets.length ; ++x) {
            Assets[x].setInterval();
            Assets[x].sortMovements();
            Assets[x].setGuess();
            // Building AssetTotal
            Assets[x].movements.forEach(movement => {
                AssetTotal.movements.push(movement);
            });
            AssetTotal.unit += Assets[x].total;
            AssetTotal.sum_in += Assets[x].sum_in;
            AssetTotal.sum_out += Assets[x].sum_out;
        }
        AssetTotal.setGuess();
        //Excluding movements before send.
        AssetTotal.movements = [];
    }
    response.json({assets: Assets, asset_total: AssetTotal});
}

async function getAssetById(request,response) {
    let asset = await Asset.find({user_id: user._id, _id:request.params.assetId});
    response.json(asset[0]);
}


/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function createAtivo(request, response) {
    const unit = (request.body.valor / request.body.quantidade).toFixed(4);
    switch(request.body.tipo) {
        case "c":
            request.body.valor *= -1; 
            break;
    }
    const ativoParams = {
        user_id: user._id,
        codigo: request.body.codigo,
        saldo: request.body.quantidade,
        unitario: unit,
        guess: 0,
        trades: {
            trade_id: mongoose.Types.ObjectId(),
            date: request.body.date,
            tipo: request.body.tipo,
            value: Number(request.body.valor),
        },
    }
    const ativo = new Ativo(ativoParams);
    try {
        await ativo.save();
        response.redirect('/ativos');
    } catch (error) {
        response.send({ error: true, errors: error.errors })
    }
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function createTrade(request, response) {    
    let tipo = request.body.tipo;
    let valor = Number(request.body.valor);
    let qtdd;
    if(isNaN(request.body.quantidade)) {
        qtdd = 0;
    } else {
        qtdd = Number(request.body.quantidade);
    }
    if(tipo=="c") {
        valor *=  -1;
    } 
    if(tipo=="v") {
        qtdd *= -1;
    }
    const id = request.body.id;
    const novotrade = {
        trade_id: mongoose.Types.ObjectId(),
        date:request.body.date,
        tipo: tipo,
        value: valor
    };
    //let ativo = await Ativo.findOne({_id: id});
    //console.log(ativo.saldo);
    ativo = await Ativo.findOneAndUpdate({_id: id}, {
        $inc: { saldo : qtdd },
        $push: {trades: novotrade}});
    //console.log(ativo);
    response.redirect('/ativos');
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function editTrade(request, response) {
    const id = request.body.id;
    const tradeid = request.body.tradeid;

    if(request.body.remove) {
        await Ativo.findOneAndUpdate({_id: id }, {$pull: {trades: {trade_id:mongoose.Types.ObjectId(tradeid) }} });
    } else {
        
        const editedtrade = {
            trade_id: mongoose.Types.ObjectId(),
            date:request.body.date,
            tipo:request.body.tipo,
            value:Number(request.body.valor)
        };

        await Ativo.findOneAndUpdate({_id: id, "trades.trade_id": mongoose.Types.ObjectId(tradeid)}, {$set: { "trades.$":editedtrade }});
    }
    response.redirect('/ativos');
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function editAtivo(request, response) {
    ativo = await Ativo.findOneAndUpdate({_id: request.body.id}, { 
        $set: {
            codigo: request.body.ativo,
            saldo: Number(request.body.saldo),
            unitario: Number(request.body.unitario),
            guess: Number(request.body.guess),
            class: { c1: request.body.class_1 , c2: request.body.class_2, c3: request.body.class_3 },
        }
    });
    
    response.redirect('/ativos');
}


module.exports = {
    /*Revised*/
    getAllAssets,
    getAssetById,

    createAtivo,
    createTrade,
    editAtivo,
    editTrade,
}
