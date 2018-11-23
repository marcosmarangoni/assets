const mongoose = require('mongoose');
//const user = mongoose.model('user', UserSchema);

const Schema = mongoose.Schema;
const AtivoSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Um User e necessario'],
      ref: 'user',
    },
    codigo: { type: String, required: [true, 'Um codigo e necessario'],
      max: [20, 'Sorry you reached the maximum number of characters'] },
    saldo:    {type: Number },
    unitario: {type: Number },
    guess:    { type: Number },
    /*div_projection: [{
      type: Object,
      timesperyear : { type: Number },
      value: { type:Number },
      datestart: { type:Date },
      dateend: { type:Date }
    }],*/
    class :{
      type: Object,
      c1: {type: String},
      c2: {type: String},
      c3: {type: String},
    },
    trades: [{
      type: Object,
      trade_id: { type: mongoose.Schema.Types.ObjectId, required: [true, 'Um codigo e necessario'] },
      date:     { type: Date }, // YYYY-MM-DD
      tipo:     { type: String },
      value:    { type: Number },
      comment:  { type: String, max: [40, 'Sorry you reached the maximum number of characters'] },
    }],
  }
);

module.exports = mongoose.model('ativo', AtivoSchema);
