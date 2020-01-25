const quoteSchema = require('../models/quote');
const assetSchema = require('../models/asset');
const axios = require('axios');
const mongoose = require('mongoose');

async function updateQuotes() {
    const assets = await assetSchema.find();
    let assetSymbols = [];
    for (const asset of assets) {
        if(assetSymbols.length == 0) {
            assetSymbols.push(asset.code);
        } 
        let hasSymbol = false;
        for (const assetSymbol of assetSymbols) {
            if (assetSymbol === asset.code) {
                hasSymbol = true;
                break;
            }
        }
        if(!hasSymbol) {
            assetSymbols.push(asset.code);
        }
    }


    let loop = 0;
    for (const symbol of assetSymbols) {
        loop++;
        console.log('[LOOP]', loop);
        try {
            let response = await axios.get('https://www.alphavantage.co/query?', {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: '7M2GANU4CTO5UTMU'
                }
            });
            await new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, 20000);
            });
            for (const key in response.data) {
                if (response.data.hasOwnProperty("Error Message")) {
                    throw new Error(response.data[key]);
                }
            }

            const globalQuote = response.data['Global Quote'];

            let newDoc = {
                id: mongoose.Schema.Types.ObjectId,
                symbol: globalQuote['01. symbol'],
                open: globalQuote['02. open'],
                high: globalQuote['03. high'],
                low: globalQuote['04. low'],
                price: globalQuote['05. price'],
                volume: globalQuote['06. volume'],
                lastest_trading_day: globalQuote['07. latest trading day'],
                previous_close: globalQuote['08. previous close'],
                change: globalQuote['09. change'],
                change_percent: globalQuote['10. change percent'],
            }
            let quote = new quoteSchema(newDoc);
            let doc = await quoteSchema.findOneAndUpdate({ symbol: symbol }, 
                { '$set': newDoc }, {
                new: true,
                upsert: true, // Make this update into an upsert
                useFindAndModify: false
            });
        } catch (error) {
            console.log('[ERROR]', error.message);
        }
    }
}

module.exports = {
    updateQuotes
}