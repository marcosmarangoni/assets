let Return = require('../services/yreturn');
const Ativo = require('../models/ativo');
let mongoose = require('mongoose');
const async = require('async');
const User = require('../models/user');

// Temporary:

let user;
async.waterfall([
    function(cb) {
        User.findOne({email:"cesar.reboucas@gmail.com"}).select({"stats.return":1 }).lean().exec(cb);
    }],
    function (err, results) {
        if(err) {console.log(err);}
        user = results;
});

//user = {_id : "5bf25f5e94e80e2d58623e2a", stats: {return: 15 }};


/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function index(request, response) {

    response.render('ativos/index'); 
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function indexList(request, response) {
    let TotalAtivos = { trades:new Array() };
    let Ativos = await Ativo.find({user_id: user._id}).sort('codigo').collation({locale: "en", strength: 1});
    let patrimonio, patriminioTotal=0;
    AtivoTotal = new Ativo();
    AtivoTotal.patrimonio = 0;
    for(let x = 0; x < Ativos.length ; ++x) {
        Ativos[x].setInterval();
        Ativos[x].sortTrades();
        Ativos[x].setGuess();
        
        AtivoTotal.trades = AtivoTotal.trades.concat(Ativos[x].trades);
        
        AtivoTotal.patrimonio += Ativos[x].patrimonio;
    }
    AtivoTotal.sum_in = 0;
    AtivoTotal.sum_out = 0;
    AtivoTotal.trades.forEach(td => {
        if(td.value > 0) {AtivoTotal.sum_in += td.value;} else {AtivoTotal.sum_out += td.value;}    
    });
    
    AtivoTotal.guess = user.stats.return;
    AtivoTotal.setGuess();

    await User.findOneAndUpdate({_id: user._id}, 
        {"stats.assetamt": AtivoTotal.patrimonio, "stats.return": AtivoTotal.guess}); 
    
    response.send({AtivosTable : Ativos , TotalAtivos: AtivoTotal});
    
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function create(request, response) {
    response.render('ativos/create'); 
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
    /*
     * Get methods
     */
    index,
    create,
    /*
     * Post methods
     */
    createAtivo,
    indexList,
    createTrade,
    editAtivo,
    editTrade,
}
