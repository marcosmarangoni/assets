const quoteSchema = require('../models/quote');
const assetSchema = require('../models/asset');
const axios = require('axios');
const mongoose = require('mongoose');

// ================
// HELPER FUNCTIONS
// ================
function throwError(apiResponseData) {
    for (const key in apiResponseData) {
        if (apiResponseData.hasOwnProperty('Error Message')) {
            throw new Error(apiResponseData[key]);
        }
    }
 }
 function apiRequestInterval() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, 20000);
    });
 }

/**
 * QUOTE ENDPOINT: https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=7M2GANU4CTO5UTMU
 * SEARCH ENDPOINT: https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=&apikey=7M2GANU4CTO5UTMU
 */

async function searchQuote(quoteName) {
  try {
    let quotes = await axios.get('https://www.alphavantage.co/query?', {
        params: {
            function: 'SYMBOL_SEARCH',
            keywords: quoteName,
            apikey: '7M2GANU4CTO5UTMU'
        }
    });
    throwError(quotes.data);
    return quotes.data['bestMatches'];
  } catch (error) {
      throw error;
  }  
}

async function updateQuotes() {
    const assets = await assetSchema.find();
    let assetsToGetQuotes = assets.filter(asset => {
        return (asset.code !== undefined && asset.code !== "" && asset.autorefresh===true);
    });
    let assetSymbols = [];
    assetsToGetQuotes.forEach((asset,i) => {
        if(assetSymbols.indexOf(asset.code)===-1) {
            assetSymbols.push(asset.code);
        }
    });
    
    for (const symbol of assetSymbols) {
        console.log('[SYMBOL]', symbol);
        try {
            let quoteValues = await axios.get('https://www.alphavantage.co/query?', {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: '7M2GANU4CTO5UTMU'
                }
            });
            throwError(quoteValues.data);


            const globalQuote = quoteValues.data['Global Quote'];

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
            };
            console.log(newDoc);
            await quoteSchema.findOneAndUpdate({ symbol: symbol }, 
                { '$set': newDoc }, {
                new: true,
                upsert: true, // Make this update into an upsert
                useFindAndModify: false
            });
            let obj = await assetSchema.updateMany({code: symbol, autorefresh:true},
                {unit: Number.parseFloat(newDoc.price)});
            console.log("RETURN", obj);
        } catch (error) {
            console.log('[ERROR]', error.message);
        }
        finally{
            await apiRequestInterval();
        }
    }
}

module.exports = {
    updateQuotes,
    searchQuote
};