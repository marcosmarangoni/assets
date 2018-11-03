const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AtivoSchema = new Schema(
  {
    codigo: {
      type: String,
      required: [true, 'Um codigo e necessario'],
      max: [20, 'Sorry you reached the maximum number of characters'],
    },
    saldo: {
      type: Number,
    },
    unitario: {
      type: Number,
    },
    trade: [{
      type: Object,
      date:{
        type: Date,  
      },
      tipo: {
        type: String,
      },
      valor: {
        type: Number,
      },
    }],
  }
);

module.exports = mongoose.model('ativo', AtivoSchema);
