var IRR = require('../models/irr');
const Ativo = require('../models/ativo');

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function index(request, response) {
    let ativos = 
    [{
        codigo : "ITSA4",
        saldo: 4600,
        unitario: 11.04,
        trade: [
            {date:'03-02-2018', value: -31008.00},
            {date:'07-03-2018', value:   1027.56},
            {date:'05-04-2018', value:    799.20},
            {date:'05-04-2018', value:  -4517.00},
            {date:'02-07-2018', value:     42.07},
            {date:'30-08-2018', value:    642.82},
            {date:'13-09-2018', value: -14130.00},
            {date:'10-10-2018', value:     46.50}
        ]
    },
    {
        codigo : "CGAS5",
        saldo: 700,
        unitario: 52.49,
        trade: [
            {date:'20-02-2017', value:-24040.00},
            {date:'03-03-2017', value:  1015.00},
            {date:'23-11-2017', value:  2897.99},
            {date:'08-01-2018', value:   595.40},
            {date:'13-09-2018', value: -9742.00}
        ]
    }
    ];

    //var Ativo = mongoose.model('../models/ativo', AtivoSchema);
    //let Ativos = await Ativo.find();
    //query.limit(5);
    //query.select('codigo trade saldo unitario');
    //let AtivoList = query.exec(err, AtivoList);
    
    

    /*query.exec(function (err, AtivoList) {
        if (err) return handleError(err);
        // athletes contains an ordered list of 5 athletes who play Tennis
        AtivoList.forEach(element => {
            //IRR.calc(element);
            element.retorno = IRR.calc(element);
        });
        ativos.forEach(element => {
            IRR.calc(element);
            element.retorno = IRR.calc(element);
        });

        response.send(AtivoList);
    });*/
    /*Ativos.forEach(element => {
        IRR.calc(element);
        element.retorno = IRR.calc(element);
        element.aaaaaa = "aaaaaaaaaaaaaaaaaaaa";
    });*/



    /* *************************************************************************** ESSA E A PARTE QUE FUNCIONA
    for(let x = 0; x < Ativos.length ; ++x) {
        //IRR.calc(element);
        Ativos[x].retorno = IRR.calc(Ativos[x]);
        Ativos[x].aaaaaa = "aaaaaaaaaaaaaaaaaaaa";
    }
    //response.send(Ativos);
    *//////////////////////////////////////////////////////////////////////////////
    

    response.render('ativos/index'); 
}

async function indexList(request, response) {
    
    let Ativos = await Ativo.find();
    Ativos[0].teste = "aaaaaaaaaaaaaaaaaaaa";
    for(let x = 0; x < Ativos.length ; ++x) {
        Ativos[x].set('retorno', IRR.calc(Ativos[x]), { strict: false });
    }
    response.send(Ativos);
}


/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function create(request, response) {
    response.render('ativos/create'); 
}

/**
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
        trade: {
            date: request.body.date,
            value: request.body.valor,
            tipo: request.body.tipo,
        },
    }
    const ativo = new Ativo(ativoParams);
    try {
        await ativo.save();
        response.send("Deu certo");
    } catch (error) {
        response.send({ error: true, errors: error.errors })
    }
    //response.send(ativo);
}
/*

async function createUser (request, response) {
    const userParams = {
        username: request.body.email,
        password: request.body.password,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        date_of_birth: '01-01-1990',
    };
    const user = new User(userParams);
    try {
        //await user.save();
        response.send();
    } catch (error) {
        response.send({ error: true, errors: error.errors })
    }
}
*/
module.exports = {
    /*
     * Get methods
     */
    index,
    indexList,
    create,
    
    /*
     * Post methods
     */
    createAtivo,
}