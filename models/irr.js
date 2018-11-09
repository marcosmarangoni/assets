/** irr.js **/

    function calc(ativo) {
        var today = new Date();
        ativo.trades.push(
            {date : today.getFullYear()+"-"+(1+today.getMonth())+("-0"+today.getDate()).slice(-3),
             tipo: "p" , value: Number((ativo.saldo * ativo.unitario).toFixed(2))
        });
        
        if(ativo.trades.length>2) {
            return irr(ativo.trades);
        } else {
            return simpleReturn(ativo.trades);
        }
    }

    function irr(fluxo) {
        var sum_in = 0;
        var sum_out = 0;

        fluxo = injectInterval(fluxo);

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
                vp_all += fluxo[x].value / guess ** fluxo[x].interval;
            }
            //console.log('Try: '+i+' VP: '+vp_all);
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
        fluxo = injectInterval(fluxo);
        var taxa;
        taxa = Math.pow(fluxo[1].value/-fluxo[0].value,(1/Math.abs(fluxo[1].interval)))-1;
        //console.log(fluxo[1].value/-fluxo[0].value);
        //console.log(fluxo[1].interval);
        return (taxa*100).toFixed(2);
    }

    function injectInterval(fluxo) {
        var date_start = 0;
        var interval_total = 0;
        
        for (i = 0; i < fluxo.length; ++i) {
            date_splited = fluxo[i].date.split('-');
            dia = new Date(date_splited[0], (date_splited[1]-1), date_splited[2], 0,0,0,0); // YYYY-MM-DD
            if(date_start==0) { // Primeiro trade
                date_start = dia;
                fluxo[i].interval = 0;
                daystoyear_start = Math.ceil(((new Date(Number(date_splited[0])+1, 0, 1, 0,0,0,0)) - dia) /1000 / 3600 / 24);
            } else {
                year_start = date_start.getFullYear();
                year_date = dia.getFullYear();
                daysonyear = Math.ceil((dia - (new Date(date_splited[0], 0, 1, 0,0,0,0)))/1000 / 3600 / 24);
                interval = year_date - year_start + (daysonyear/365)  + (daystoyear_start/365) - 1 ;
                fluxo[i].interval = interval;
                interval_total += Math.abs(interval); //Protect Mesmo DIa
            }
        }
        if(interval_total < 0.013) {  //Protect Mesmo DIa
            fluxo[fluxo.length-1].interval = 0.013;
        }
        return fluxo;
    }


module.exports.calc = calc;
    