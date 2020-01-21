const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovementSchema = new Schema({
  /*mov_id: { type: mongoose.Schema.Types.ObjectId },*/
  date: {
    type: Date,
    required: [true, "We need a date for each Movement"],
    default: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
  }, // YYYY-MM-DD
  kind: {
    type: String,
    required: [true, "The kind of movement must be specified"],
    default: 'div'
  },
  value: {
    type: Number,
    default: 0
  },
  comment: {
    type: String, max: [40, 'Sorry you reached the maximum number of characters'],
    default: null
  },
});

const Movement = mongoose.model('movement', MovementSchema);

module.exports = {
  MovementSchema,
  Movement
};
