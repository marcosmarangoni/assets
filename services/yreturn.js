/** irr.js **/

    function calc(trades, atual, guess) {

        const tempNow = new Date();
        const now = new Date(tempNow.getFullYear(), tempNow.getMonth(), tempNow.getDate(),0,0,0,0);
        trades.push(
            {date: now,
             tipo: "p" , 
             value: Number(atual.toFixed(2)),
             interval: 0
        });


        
        let sum_in = 0, sum_out = 0;
        let daysonthisyear, daystonextyear;
        const currentyear = now.getFullYear();
        const milionaday = 86400000 // 1000 * 60 * 60 * 24;
        daysonthisyear = Math.ceil((now - new Date(currentyear, 0 ,1 , 0, 0, 0, 0))/ milionaday );

        let date; // to be used as the trade date
        for(let x=0; x < trades.length ; ++x) {
            if(typeof trades[x].date=='string') {
                date = trades[x].date.split('-');
                trades[x].date = new Date(date[0], date[1]-1, date[2], 0,0,0,0);}
            daystonextyear = Math.ceil((new Date((trades[x].date.getFullYear()+1) , 0 , 1, 0, 0, 0, 0) - trades[x].date) / milionaday);
            trades[x].interval = (currentyear - trades[x].date.getFullYear()) + ((daysonthisyear + daystonextyear)/365) - 1;
            if(trades[x].value > 0) {sum_in += trades[x].value;} else {sum_out -= trades[x].value;}
        }
        
        trades.sort(date_sort_asc);

        //Calculo apenas com um minimo de 29 dias. (29/365) = ~ 0.08
        const min_interval = 0.08;
        let intervaltotal = trades[0].interval - trades[(trades.length-1)].interval;
        let retorno = (sum_in / sum_out);
        if( intervaltotal < min_interval || trades.length <= 2 ) { // Intervalo pequeno ou apenas 2 movimentos
            if( isNaN(retorno) || retorno<=0.01 ) { // sem saida ou sem entrada / prejuizo muito grande.
                console.log("Retorno da merda");
                return -99; 
            } else { // Calculo Simples
                console.log("Retorno simples "+trades.length);
                return (Math.pow(retorno,( 1/ Math.max(min_interval,intervaltotal) ))-1)*100;
            } 
        } else { 
            if( isNaN(guess) ) { guess = retorno; }
            else { guess = (guess/100)+1; }
            return irr( trades,guess,sum_in,intervaltotal ); 
        }
    }

    function irr(fluxo,guess,sum_in,intervaltotal) {
        
        
        var i=0;
        var vp_second = 0;
        var guess_second = 0;
        var vp_third = 0;
        var guess_third = 0;

        do {
            ++i;
            vp_all = 0;
            for(x=0; x < fluxo.length; ++x) {
                vp_all += fluxo[x].value * Math.pow( guess , fluxo[x].interval );
            }
            //console.log('Try: '+i+' VP: '+vp_all.toFixed(4) + ' Guess: '+guess.toFixed(4) + ' Interval: '+intervaltotal.toFixed(3));
            vp_third = vp_second;
            guess_third = guess_second;
            vp_second = vp_all;
            guess_second = guess;

            if(vp_second!=0 && vp_third!=0) {
                //guess = (((-vp_second*guess_third)+(vp_second*guess_second))/( vp_third - vp_second )) + guess_second;
                guess = ((guess_third * vp_second) - (guess_second * vp_third)) / (vp_second - vp_third);
            } else if(vp_all > 0) {
                    guess += (vp_all*3/sum_in);
                } else {
                    guess -= (-vp_all*3/sum_in);
                }
        }
        while (Math.abs(vp_all) > 0.01 && guess<=100 && i <= 500);
        console.log('IRR: '+Number((guess-1)*100).toFixed(2)+' Try:'+i );
        return Number(((guess-1)*100).toFixed(2));
    }

    function simpleReturn(fluxo) {
        var taxa;
        taxa = Math.pow(fluxo[1].value/-fluxo[0].value,(1/Math.abs(fluxo[1].interval + fluxo[0].interval)))-1; // Um dos interval vai ser 0;
        
        console.log("SimpleReturn");
        return (taxa*100).toFixed(2);
    }

    var date_sort_asc = function (tradeA, tradeB) {
        //if (tradeA.date > tradeB.date) return 1;
        //if (tradeA.date < tradeB.date) return -1;
        //return 0;
        return tradeA.date - tradeB.date
      };

module.exports.calc = calc;