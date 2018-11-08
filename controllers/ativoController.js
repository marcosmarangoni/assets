var IRR = require('../models/irr');
const Ativo = require('../models/ativo');
var mongoose = require('mongoose');

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
    
    let Ativos = await Ativo.find();
    for(let x = 0; x < Ativos.length ; ++x) {
        Ativos[x].set('retorno', IRR.calc(Ativos[x]), { strict: false });
    }
    response.send(Ativos);
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
    const unit = (request.body.valor / request.body.quantidade);
    switch(request.body.tipo) {
        case "c":
            request.body.valor *= -1; 
            break;
    }
    const ativoParams = {
        codigo: request.body.codigo,
        saldo: request.body.quantidade,
        unitario: unit,
        trades: {
            trade_id: mongoose.Types.ObjectId(),
            date: request.body.date,
            value: Number(request.body.valor),
            tipo: request.body.tipo,
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

    /*(async () => {
        try {
          let ativo = await Ativo.find({_id:request.body._id});
          console.log('num', ativo);
        } catch(e) {
          console.log('Error caught');
        }
      })();*/

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
    await Ativo.findOneAndUpdate({_id: request.body.id}, { 
        $set: {
            codigo: request.body.ativo,
            saldo: Number(request.body.saldo),
            unitario: Number(request.body.unitario),
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