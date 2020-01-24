const mongoose = require('mongoose');
const momentjs = require('moment');
const Schema = mongoose.Schema;

const MovementSchema = new Schema({
  /*mov_id: { type: mongoose.Schema.Types.ObjectId },*/
  date: {
    type: Date,
    required: [true, 'We need a date for each Movement'],
    default: new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
  }, // YYYY-MM-DD
  kind: {
    type: String,
    required: [true, 'The kind of movement must be specified'],
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

MovementSchema.virtual('interval').get( function() {
  //const tempNow = new Date();
  const now = new Date();

  const today = momentjs().hour(0).minute(0).second(0);
  const movementDate = momentjs(this.date);
  console.log(movementDate.format());
  console.log('DURATION', momentjs.duration(today.diff(movementDate)).asYears());

  const currentyear = now.getUTCFullYear();
  //console.log(tempNow);
  //console.log(momentjs().hour(0).minute(0).second(0).format());
  const milionaday = 86400000; // 1000 * 60 * 60 * 24;
  const daysonthisyear = Math.ceil((now - new Date(currentyear, 0, 1, 0, 0, 0, 0)) / milionaday);
  let dateArr, daystonextyear;
  if (typeof this.date === 'string') {
    dateArr = this.date.split('-');
    this.date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0);
  }
  //console.log(this.date);
  //console.log("Data apurada",this.date);
  //console.log("Data Now",now);
  // TODO fix the DATE ISSUE!!!
  daystonextyear = Math.ceil((new Date((this.date.getUTCFullYear() + 1), 0, 1, 0, 0, 0, 0) - this.date) / milionaday);
  return (currentyear - this.date.getUTCFullYear()) + ((daysonthisyear + daystonextyear) / 365) - 1;
});

const Movement = mongoose.model('movement', MovementSchema);
module.exports = {
  MovementSchema,
  Movement
};
