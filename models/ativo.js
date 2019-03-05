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

AtivoSchema.methods.setInterval = function() {
  const tempNow = new Date();
  this.sum_in = 0;
  this.sum_out = 0;
  const now = new Date(tempNow.getFullYear(), tempNow.getMonth(), tempNow.getDate(),0,0,0,0);
  const currentyear = now.getFullYear();
  const milionaday = 86400000 // 1000 * 60 * 60 * 24;
  const daysonthisyear = Math.ceil((now - new Date(currentyear, 0 ,1 , 0, 0, 0, 0))/ milionaday );
  let dateArr, daystonextyear;

  for(let x=0; x < this.trades.length; ++x) {
    if(typeof this.trades[x].date=='string') {
      dateArr = this.trades[x].date.split('-');
      this.trades[x].date = new Date(dateArr[0], dateArr[1]-1, dateArr[2], 0,0,0,0);
    }   
    daystonextyear = Math.ceil((new Date((this.trades[x].date.getFullYear()+1) , 0 , 1, 0, 0, 0, 0) - this.trades[x].date) / milionaday);
    this.trades[x].interval = (currentyear - this.trades[x].date.getFullYear()) + ((daysonthisyear + daystonextyear)/365) - 1;
    if(this.trades[x].value > 0) {this.sum_in += this.trades[x].value;} else {this.sum_out += this.trades[x].value;}
  }
  
  
  //this.set('patrimonio', Number(this.unitario * this.saldo), { strict: false });
  
  this.trades.push(
    {date: now,
    tipo: "p" , 
    value: this.patrimonio,
    interval: 0}
  );
  //console.log("This: "+this);
  this.sum_in += this.patrimonio;
};

AtivoSchema.methods.sortTrades = function() {
  this.trades.sort(function (tA, tB) {
    return (tA.date - tB.date);
  })
};

AtivoSchema.methods.setGuess = function () {
  //Calculo apenas com um minimo de 29 dias. (29/365) = ~ 0.08
  const min_interval = 0.08;
  let retorno = (this.sum_in / -this.sum_out);
  //console.log(retorno);

  if( this.trades[0].interval < min_interval || this.trades.length == 2 ) { // Intervalo pequeno ou apenas 2 movimentos
    if( isNaN(retorno) || retorno<=0.01 ) { // sem saida ou sem entrada / prejuizo muito grande.
        console.log("Retorno da Merda - "+this.codigo);
        this.guess = -0.99; 
    } else { // Calculo Simples
        console.log("Ret Simples Oper: "+this.trades.length+" Taxa:"+(Math.pow(retorno,(1/Math.max(min_interval,this.trades[0].interval)))-1)+" "+this.codigo);
        this.guess =(Math.pow(retorno,(1/Math.max(min_interval,this.trades[0].interval)))-1);
    } 
  } else { 
    if( isNaN(this.guess) ) { this.guess = retorno; }
    this.irr(); 
  }
};

AtivoSchema.methods.irr = function() {
  
  var i=0;
  var vp_second = 0;
  var guess_second = 0;
  var vp_third = 0;
  var guess_third = 0;

  do {
    // Seguranca do Guess
    if((this.guess > 2 && i==0) || (this.guess < -0.5 && i==0) || isNaN(this.guess)) { // Maior que 200% ou menor que -50%
      this.guess = 0.1 * i;
    } 
    ++i;
    vp_all = this.checkVP();
    
    if(isNaN(vp_all)) {
      this.guess = 0;
      vp_all = this.checkVP();
      if(isNaN(vp_all)) {
        i = 500;
        this.guess = 0;
        break;
      }
    }

    vp_third = vp_second;
    guess_third = guess_second;
    vp_second = vp_all;
    guess_second = this.guess;
    
    console.log('Try: '+i+' VP: '+vp_all.toFixed(4) + ' Guess: '+this.guess.toFixed(8)+' IN:'+this.sum_in+' COD: '+this.codigo);
    
    if(vp_third!=0) {
        //guess = (((-vp_second*guess_third)+(vp_second*guess_second))/( vp_third - vp_second )) + guess_second;
        //guess = ((guess_third * vp_second) - (guess_second * vp_third)) / (vp_second - vp_third);
        this.guess = guess_second - (((guess_third - guess_second) * vp_second) / (vp_third - vp_second));

        console.log('New Gues by Interpolation: '+this.guess);
        console.log('Used -> Gues_Sec: '+guess_second+' Guess_Third: '+guess_third);
        console.log('Used -> Vp_Sec: '+vp_second+' VP_Third: '+vp_third);

    } else {
            this.guess += (vp_all/this.sum_in);
            console.log('New Gues by else '+this.guess);
    } 
    

    //console.log("VPS: "+vp_all+" "+vp_second+" "+vp_third);
    console.log('\n');
  
  } while (Math.abs(vp_all) > 0.01 &&  i < 500);
  console.log('IRR: '+Number(this.guess*100).toFixed(2)+'% Try:'+i );
}

AtivoSchema.methods.checkVP = function() {
  let sum = 0;
  guessPlusOne = (this.guess + 1);
  this.trades.forEach(element => {
    sum += element.value * Math.pow( (guessPlusOne) , element.interval );
  });
  return sum;
}

AtivoSchema.virtual('patrimonio').get(function() {
  return Number(this.saldo * this.unitario);
}).
set(function(v) {
  this.saldo = 1;
  this.unitario = v;
});

AtivoSchema.set('toJSON', { getters: true, virtuals: true });


module.exports = mongoose.model('ativo', AtivoSchema);
