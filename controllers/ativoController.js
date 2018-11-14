let YReturn = require('../services/yreturn');
const Ativo = require('../models/ativo');
let mongoose = require('mongoose');
const async = require('async');

// Temporary:
const User = require('../models/user');
let user;
async.waterfall([
    function(cb) {
        User.findOne({email:"marcosmarangoni2@gmail.com"}).select('first_name').lean().exec(cb);;
        
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
        Ativos[x].set('retorno', YReturn.calc(Ativos[x].trades, patrimonio), { strict: false });
        Ativos[x].set('patrimonio', patrimonio, { strict: false });
        Array.prototype.push.apply(TotalAtivos.trades,Ativos[x].trades); 
        patriminioTotal += patrimonio;
    }
    TotalAtivos.retorno = YReturn.calc(TotalAtivos.trades, 0);
    TotalAtivos.patrimonio = patriminioTotal;
    delete TotalAtivos.trades;
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
        user_id: user.id,
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
        //response.send("Deu certo");
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

    //await console.log(mongoose.Types.ObjectId());
    //await console.log(novotrade);
    ativo = await Ativo.findOneAndUpdate({_id: id}, {$push: {trades: novotrade}});
    //await console.log("ID*************"+id);
            
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

    //await console.log('Trade: ' +id+ ' Trade_ID: '+tradeid  );
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
        }
    });
    console.log(ativo)
    console.log(JSON.stringify({_id: request.body.id}));
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