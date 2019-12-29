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
                return -0.99; 
            } else { // Calculo Simples
                console.log("Retorno simples "+trades.length+" Taxa:"+(Math.pow(retorno,(1/Math.max(min_interval,intervaltotal)))-1));
                return (Math.pow(retorno,(1/Math.max(min_interval,intervaltotal)))-1);
            } 
        } else { 
            if( isNaN(guess) ) { guess = retorno; }
            return irr( trades,guess,sum_in ); 
        }
    }

    function irr(fluxo,guess,sum_in) {
        
        
        var i=0;
        var vp_second = 0;
        var guess_second = 0;
        var vp_third = 0;
        var guess_third = 0;

        do {
            // Seguranca do Guess
            if(guess > 2 || guess < -0.5 || isNaN(guess)) { // Maior que 200% ou menor que -50%
                guess = 0.1 * i;
            }
            ++i;
            vp_all = 0;
            fluxo.forEach(element => {
                vp_all += element.value * Math.pow( (1+guess) , element.interval );
            });
            console.log('Try: '+i+' VP: '+vp_all.toFixed(4) + ' Guess: '+guess.toFixed(4)+' IN:'+sum_in);

            if(vp_third!=0) {
                //guess = (((-vp_second*guess_third)+(vp_second*guess_second))/( vp_third - vp_second )) + guess_second;
                //guess = ((guess_third * vp_second) - (guess_second * vp_third)) / (vp_second - vp_third);
                guess = guess_second -(((guess_third - guess_second) * vp_second) / (vp_third - vp_second));

                console.log('Gues by Interpolation');
                console.log('Gues_Sec: '+guess_second+' Guess_Third: '+guess_third);
                console.log('Vp_Sec: '+vp_second+' VP_Third: '+vp_third);

            } else {
                    guess += (vp_all/sum_in);
                    console.log('Gues by else');
            } 
            console.log("Guess: "+guess+" VP: "+vp_all+" SUM: "+sum_in);
            vp_third = vp_second;
            guess_third = guess_second;
            vp_second = vp_all;
            guess_second = guess;

            //console.log("VPS: "+vp_all+" "+vp_second+" "+vp_third);
            console.log('\n');

        }
        while (Math.abs(vp_all) > 0.01 && guess<=100 && i <= 500);
        console.log('IRR: '+Number((guess-1)*100).toFixed(2)+' Try:'+i );
        return Number(((guess)*100).toFixed(2));
    }

    var date_sort_asc = function (tradeA, tradeB) {
        return tradeA.date - tradeB.date
      };

module.exports.calc = calc;