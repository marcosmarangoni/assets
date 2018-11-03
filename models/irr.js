/** irr.js **/

    //console.log("Model used");
    function IRRA(data) {
        return data + "aqui";
    }
    var IRRA = function (data) {
        //this.data = data;
        console.log("aa");
        return data;
    }

    var PI = Math.PI;
    function circle (radius) {
        return radius * radius * PI;
    }

    function calc(ativo) {
        ativo.trade.push({ dia : "31-10-2018" , valor: Number((ativo.saldo * ativo.unitario).toFixed(2))});
        console.log(ativo);
        return irr(ativo.trade);
    }

    function irr(fluxo) {
        var sum_in = 0;
        var sum_out = 0;
        var date_start = 0;
        var daysonyear_start;
        var interval_total = 0;

        for (i = 0; i < fluxo.length; ++i) {
            date_splited = fluxo[i].dia.split('-');
            dia = new Date(date_splited[2], (date_splited[1]-1), date_splited[0], 0,0,0,0);
            if(date_start==0) { // Primeiro trade
                date_start = dia;
                fluxo[i].interval = 0;
                //console.log(new Date(Number(date_splited[2])+1, 0, 1, 0,0,0,0));
                daystoyear_start = Math.ceil(((new Date(Number(date_splited[2])+1, 0, 1, 0,0,0,0)) - dia) /1000 / 3600 / 24);
            } else {
                year_start = date_start.getFullYear();
                year_date = dia.getFullYear();
                daysonyear = Math.ceil((dia - (new Date(date_splited[2], 0, 1, 0,0,0,0)))/1000 / 3600 / 24);
                interval = year_date - year_start + (daysonyear/365)  + (daystoyear_start/365) - 1 ;
                //console.log('daysonyear: '+daysonyear+' daysonyear_start: '+daystoyear_start)
                fluxo[i].interval = interval;
                interval_total += Math.abs(interval); //Protect Mesmo DIa
            }
            if(fluxo[i].valor > 0) {sum_in += fluxo[i].valor;} else {sum_out -= fluxo[i].valor;}
            //console.log(fluxo[i]);
        }

        if(interval_total < 0.013) {  //Protect Mesmo DIa
            fluxo[fluxo.length-1].interval = 0.013;
        }
        
        var guess = (sum_in/sum_out);
        var i=1;
        var vp_second = 0;
        var guess_second = 0;
        var vp_third = 0;
        var guess_third = 0;

        do {
            console.log('Guess: '+guess);
            vp_all = 0;

            for(x=0; x < fluxo.length; ++x) {
                vp_all += fluxo[x].valor / guess ** fluxo[x].interval;
            }
            console.log('Try: '+i+' VP: '+vp_all);

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
        //console.log('IRR Official: '+Number((guess-1)*100).toFixed(2));
        return Number(((guess-1)*100).toFixed(2));
    }

module.exports.circle = circle;
module.exports.calc = calc;
module.exports.IRRA = IRRA;
    