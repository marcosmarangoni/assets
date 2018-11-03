var IRR = require('../models/irr');
var IRR = require('../models/irr');

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
            {dia:'03-02-2018', valor: -31008.00},
            {dia:'07-03-2018', valor:   1027.56},
            {dia:'05-04-2018', valor:    799.20},
            {dia:'05-04-2018', valor:  -4517.00},
            {dia:'02-07-2018', valor:     42.07},
            {dia:'30-08-2018', valor:    642.82},
            {dia:'13-09-2018', valor: -14130.00},
            {dia:'10-10-2018', valor:     46.50}
        ]
    },
    {
        codigo : "CGAS5",
        saldo: 700,
        unitario: 52.49,
        trade: [
            {dia:'20-02-2017', valor:-24040.00},
            {dia:'03-03-2017', valor:  1015.00},
            {dia:'23-11-2017', valor:  2897.99},
            {dia:'08-01-2018', valor:   595.40},
            {dia:'13-09-2018', valor: -9742.00}
        ]
    }
    ];

    ativos.forEach(element => {
        //IRR.calc(element);
        element.retorno = IRR.calc(element);
    });

    response.render('ativos/index', { title: 'Expresssa', ativos }); 
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

    const ativo = {
        codigo: request.body.codigo,
        date: request.body.date,
        quantidade: request.body.quantidade,
        tipo: request.body.tipo,
        valor: request.body.valor,
    }
    response.send(ativo);
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
    create,
    
    /*
     * Post methods
     */
    createAtivo,
}