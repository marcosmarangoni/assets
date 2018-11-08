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
    trade: [{        // Tambem tem Object ID
      type: Object,
      date:{
        type: Date,  // YYYY-MM-DD 
      },
      tipo: {
        type: String,
      },
      value: {
        type: Number,
      },
    }],
  }
);

module.exports = mongoose.model('ativo', AtivoSchema);
