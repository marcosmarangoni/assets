let YReturn = require('../services/yreturn');
const Ativo = require('../models/ativo');
let mongoose = require('mongoose');
const async = require('async');
const User = require('../models/user');

// Temporary:

let user;
async.waterfall([
    function(cb) {
        User.findOne({email:"marcosmarangoni2@gmail.com"}).select({"first_name":1, "stats.return":1 }).lean().exec(cb);
    }],
    function (err, results) {
        if(err) {console.log(err);}
        user = results;
});

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
    for(let x = 0; x < Ativos.length ; ++x) {
        patrimonio = Number(Ativos[x].unitario * Ativos[x].saldo)
        Ativos[x].set('retorno', YReturn.calc(Ativos[x].trades, patrimonio, Ativos[x].guess), { strict: false });
        Ativos[x].set('patrimonio', patrimonio, { strict: false });
        Array.prototype.push.apply(TotalAtivos.trades,Ativos[x].trades); 
        patriminioTotal += patrimonio;
    }
    TotalAtivos.retorno = YReturn.calc(TotalAtivos.trades, 0, user.stats.return);
    TotalAtivos.patrimonio = patriminioTotal;
    delete TotalAtivos.trades;

    await User.findOneAndUpdate({_id: user._id}, 
        {"stats.assetamt": TotalAtivos.patrimonio, "stats.return": TotalAtivos.retorno}); 
    //console.log(user);
    response.send({AtivosTable : Ativos, TotalAtivos: TotalAtivos});
    
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
        div_projection: {timesperyear:0, value:0, datestart:null, dateend: null},
        trades: {
            trade_id: mongoose.Types.ObjectId(),
            date: request.body.date,
            tipo: request.body.tipo,
            value: Number(request.body.valor),
            comment: "Inicial",
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

    

    const id = request.body.id;
    const novotrade = {
        trade_id: mongoose.Types.ObjectId(),
        date:request.body.date,
        tipo:request.body.tipo,
        value:Number(request.body.valor)
    };
    
    ativo = await Ativo.findOneAndUpdate({_id: id}, {$push: {trades: novotrade}});

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
    const editedtrade = {
        trade_id: mongoose.Types.ObjectId(),
        date:request.body.date,
        tipo:request.body.tipo,
        value:Number(request.body.valor)
    };

    await Ativo.findOneAndUpdate({_id: id, "trades.trade_id": mongoose.Types.ObjectId(tradeid)}, {$set: { "trades.$":editedtrade }});
    
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
