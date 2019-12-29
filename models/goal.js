const mongoose = require('mongoose');
//const user = mongoose.model('user', UserSchema);

const Schema = mongoose.Schema;
const GoalSchema = new Schema(
    {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Um User e necessario'],
      ref: 'user',
    },
    fluxos:[{
        type: Object,
            fluxo_id: { type: mongoose.Schema.Types.ObjectId, required: [true, 'Um codigo e necessario'] },
            nome: { type: String},
            comportamento: { type: String},
            datestart: { type: String},
            dateend: { type: String},
            valorinicial: { type: Number},
            patvalue: { type: Boolean, default:false },
            cresrate: { type: Number},
            patrate: { type: Boolean, default:false }
    }]
  }
);

module.exports = mongoose.model('goal', GoalSchema);
