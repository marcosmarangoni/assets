/** irr.js **/

    function calc(trades, atual) {
        let date; // to be used as the trade date
        let tempNow = new Date();
        let now = new Date(tempNow.getFullYear(), tempNow.getMonth(), tempNow.getDate(),0,0,0,0);
        let daysonthisyear, daystonextyear;
        let currentyear = now.getFullYear();
        let milionaday = 86400000 // 1000 * 60 * 60 * 24;
        daysonthisyear = Math.ceil((now - new Date(currentyear, 0 ,1 , 0, 0, 0, 0))/ milionaday );
        //console.log('daysONTHISyear: ' + daysonthisyear);


        for(let x=0; x < trades.length ; ++x) {
            if(typeof trades[x].date=='string') {
                date = trades[x].date.split('-');
                trades[x].date = new Date(date[0], date[1]-1, date[2], 0,0,0,0);}
            daystonextyear = Math.ceil((new Date((trades[x].date.getFullYear()+1) , 0 , 1, 0, 0, 0, 0) - trades[x].date) / milionaday);
            //console.log('daysTONEXTyear: ' + daystonextyear);
            trades[x].interval = (currentyear - trades[x].date.getFullYear()) + ((daysonthisyear + daystonextyear)/365) - 1;
            //if(trades[x].interval < 0.013) { trades[x].interval = 0.013; } //Protect Mesmo Dia
            //console.log('Interval: '+trades[x].interval);
        }
        trades.push(
            {date: now,
             tipo: "p" , 
             value: Number(atual.toFixed(2)),
             interval: 0
        });

        trades.sort(date_sort_asc);
        //console.log(ativo)

        if(trades.length>2) {
            return irr(trades);
        } else {
            return simpleReturn(trades);
        }
    }

    function irr(fluxo) {
        var sum_in = 0;
        var sum_out = 0;

        for (i = 0; i < fluxo.length; ++i) {
            if(fluxo[i].value > 0) {sum_in += fluxo[i].value;} else {sum_out -= fluxo[i].value;}
        }
        
        var guess = (sum_in/sum_out);
        var i=1;
        var vp_second = 0;
        var guess_second = 0;
        var vp_third = 0;
        var guess_third = 0;

        do {
            //console.log('Guess: '+guess);
            vp_all = 0;

            for(x=0; x < fluxo.length; ++x) {
                vp_all += fluxo[x].value * Math.pow( guess , fluxo[x].interval );
            }
            //console.log('Try: '+i+' VP: '+vp_all + ' Guess: '+guess);
            vp_third = vp_second;
            guess_third = guess_second;
            vp_second = vp_all;
            guess_second = guess;

            if(vp_second!=0 && vp_third!=0) {
                guess = (((-vp_second*guess_third)+(vp_second*guess_second))/( vp_third - vp_second )) + guess_second;
            } else if(vp_all > 0) {
                    guess += (vp_all*3/sum_in);
                } else {
                    guess -= (vp_all*3/-sum_in);
                }
            ++i;
        }
        while (Math.abs(vp_all) > 0.01 && guess<=100 && i <= 500);
        console.log('IRR: '+Number((guess-1)*100).toFixed(2)+' Try:'+i );
        return Number(((guess-1)*100).toFixed(2));
    }

    function simpleReturn(fluxo) {
        var taxa;
        taxa = Math.pow(fluxo[1].value/-fluxo[0].value,(1/Math.abs(fluxo[1].interval + fluxo[0].interval)))-1; // Um dos interval vai ser 0;
        //console.log(fluxo[1].value/-fluxo[0].value);
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
    