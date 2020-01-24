const Asset = require('../models/asset.js');
const { Movement } = require('../models/movement.js');
let mongoose = require('mongoose');


/*************************************/
// Get a list of assets with or without IRR and a AssetsSumary
async function getAllAssets(request, response) {
    let Assets = await Asset.find({ user_id: request.user.id }).sort('code').collation({ locale: "en", strength: 1 });
    let AssetTotal = new Asset();
    if (request.query.irr !== undefined && request.query.irr === '1') {
        AssetTotal = new Asset();
        AssetTotal.unit = 0;
        AssetTotal.balance = 1;
        AssetTotal.sum_in = 0;
        AssetTotal.sum_out = 0;
        for (let x = 0; x < Assets.length; ++x) {
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
    response.json({ assets: Assets, asset_total: AssetTotal });
}

/*************************************/
// Get One Asset by its ID
async function getAssetById(request, response) {
    let asset = await Asset.findOne({ user_id: request.user.id, _id: request.params.asset });
    response.json(asset);
}

/*************************************/
// Add a new Asset
async function newAsset(request, response) {

    let value = request.body.value;
    if (request.body.kind === 'buy') {
        value *= -1;
    }

    let movement = new Movement({
        date: request.body.date,
        kind: request.body.kind,
        value: value,
        comment: request.body.comment,
    });

    let asset = new Asset({
        user_id: request.user.id,
        code: request.body.code,
        autorefresh: request.body.autorefresh,
        movements: [movement],
        balance: Number(request.body.balance),
        unit: Number(request.body.unit),
        group: {
            group_a: request.body.group_a,
            group_b: request.body.group_b,
            group_c: request.body.group_c,
        },
    });
    try {
        //new var to force tha catch if that is the case
        const saved = await asset.save();
        response.json(saved);
    } catch (err) {
        response.status(500).send(err.message);
    }
}

/*************************************/
// Add a new Movement to a movement
async function newMovement(request, response) {
    let increment = 0;
    let value = Number(request.body.value);
    switch (request.body.kind) {
        case "sell": //Decrement
            increment = -(Number(request.body.balance));
            break;
        case "buy": // Increment
            increment = (Number(request.body.balance));
            value = -value;
            break;
        default:
            break;
    }

    let movement = new Movement({
        date: request.body.date,
        kind: request.body.kind,
        value: value,
        comment: request.body.comment,
    });

    try {
        let asset = await Asset.findOneAndUpdate({ _id: request.body.asset }, {
            $inc: { balance: increment },
            $push: { movements: movement }
        });
        response.json(movement);

    } catch (error) {
        response.status(500).send(error.message);
    }
}

/************************************************************/
//Edit Asset
async function editAsset(request, response) {

    let partialAsset = {
        code: request.body.code,
        balance: Number(request.body.balance),
        unit: Number(request.body.unit),
        autorefresh: request.body.autorefresh,
        group: {
            group_a: request.body.group_a,
            group_b: request.body.group_b,
            group_c: request.body.group_c,
        },
    };
    try {
        let asset = await Asset.findOneAndUpdate({ user_id: request.user.id, _id: request.body.asset }, {
            $set: partialAsset
        });
        response.json(asset);

    } catch (error) {
        response.status(500).send(error.message);
    }
}

/************************************************************/
// Edit Movement
async function editMovement(request, response) {
    const id = request.body.id;
    const tradeid = request.body.tradeid;

    if (request.body.remove !== undefined && request.body.remove) {

        //await Ativo.findOneAndUpdate({ _id: id }, { $pull: { trades: { trade_id: mongoose.Types.ObjectId(tradeid) } } });

    } else {

        const partialMovement = {
            date: new Date(request.body.date),
            kind: request.body.kind,
            value: Number(request.body.value),
            comment: request.body.comment,
        };

        //TODO DELETE!

        try {

            let asset = await Asset.findOne({ user_id: request.user.id, _id: request.body.asset });
            let movement = asset.movements.id(request.body.movement);
            movement.set(partialMovement);
            await asset.save();          
            response.json(movement);
            
        } catch (error) {
            response.status(500).send(error.message);
        }

    }
}


module.exports = {
    /*Revised*/
    getAllAssets,
    getAssetById,
    newAsset,
    newMovement,
    editAsset,
    editMovement
}
