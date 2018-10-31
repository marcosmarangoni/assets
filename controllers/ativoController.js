//var Author = require('../models/ativo');

// Display list of all Authors.
exports.index = function(req, res) {
    var trades = [
        {dia:'31-12-2011', valor:   -15.00},
        {dia:'17-01-2012', valor: -1000.00},
        {dia:'10-03-2012', valor:  +100.00},
        {dia:'31-07-2012', valor:  +100.00},
        {dia:'24-12-2012', valor: +1010.00},
        {dia:'10-03-2012', valor:  -1000.00},
        {dia:'10-03-2012', valor:  +1410.00},
        {dia:'03-02-2018', valor: -31008.00},
        {dia:'07-03-2018', valor:   1027.56},
        {dia:'05-04-2018', valor:    799.20},
        {dia:'05-04-2018', valor:  -4517.00},
        {dia:'02-07-2018', valor:     42.07},
        {dia:'30-08-2018', valor:    642.82},
        {dia:'09-09-2018', valor:  30055.00}];

    res.render('ativos/index', { title: 'Expresssa', trades : JSON.stringify(trades), trades2:trades,  query : JSON.stringify( req.query) });
    
};