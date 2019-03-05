"use strict";
class Return {
    
    constructor(trades, patrimonio, guess)
    {
        this.retorno = 0;
        this.trades = trades;
        this.setIntervals(patrimonio);
        
        //console.log(this.trades);
    }

    setIntervals(patrimonio) {
        const tempNow = new Date();
        const now = new Date(tempNow.getFullYear(), tempNow.getMonth(), tempNow.getDate(),0,0,0,0);
        const currentyear = now.getFullYear();
        const milionaday = 86400000 // 1000 * 60 * 60 * 24;
        const daysonthisyear = Math.ceil((now - new Date(currentyear, 0 ,1 , 0, 0, 0, 0))/ milionaday );
        let dateArr, date, daystonextyear;
        this.trades.push(
            {tipo: "p",
             value: Number(patrimonio.toFixed(2)),
             interval: 0,
        });
        for(let x=0; x < this.trades.length; ++x) {
            if(typeof this.trades[x].date=='string') {
                dateArr = this.trades[x].date.split('-');
                date = new Date(dateArr[0], dateArr[1]-1, dateArr[2], 0,0,0,0);}
                daystonextyear = Math.ceil((new Date((date.getFullYear()+1) , 0 , 1, 0, 0, 0, 0) - date) / milionaday);
                this.trades[x].interval = (currentyear - date.getFullYear()) + ((daysonthisyear + daystonextyear)/365) - 1;
                //if(this.trades[x].value > 0) {sum_in += this.trades[x].value;} else {sum_out -= this.trades[x].value;}
                console.log(this.trades[x]);
        }
        
        //console.log(this.trades);
    }

    setPatrimonioToTrade(pat) {

    }

}
module.exports = Return;