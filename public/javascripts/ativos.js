
/* Formatting function for row details - modify as you need */
function formatTable ( d ) {
    // d is the original data object for the row
    let t =  '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;width:100%;">';
    let tipo;
    d.trade.forEach(element => {
        var disabled = "";
        switch(element.tipo) {
            case "c": 
                tipo = "Compra";
                break;
            case "v":
                tipo = "Venda"
                break;
            case "p":
                tipo = "Patrimonio"
                disabled = " disabled ";
                break;
            case "d":
                tipo = "Dividendo"
                break;
        }
        t += '<tr><td>'+tipo+'</td>'+            
                    '<td class="text-right">'+element.date+'</td>\
                    <td class="text-right">'+Number(element.value).toFixed(2)+'</td>\
                    <td class="text-center"><button '+disabled+' onClick="\
                    fillEditTradeModal(\''+(d._id)+'\',\''+element.trade_id+'\',\''+
                        element.date+'\',\''+element.value+'\',\''+element.tipo+'\')" \
                    class="btn btn-sm">Edit Trade</button></td></tr>';
    });
    t += '</table>';
    return t;
}

function fillEditTradeModal(objid, tradeid, date, value, tipo) {
    //tradeObj = JSON.parse(trade);

    alert('OBJ:'+objid+' Trade:'+tradeid);
    $('#f3txtid').val(objid);
    $('#f3txttradeid').val(tradeid);
    $('#f3txttradeid').val(tradeid);
    $('#f3txtdate').val(date);
    $('#f3txtvalor').val(value);
    $('#f3seltipo').val(tipo);
    $('#EditTradeModal').modal('show');
}

 
$(document).ready(function() {

    var ativosList = $('#ativosList').DataTable({
        ajax: {
            url: '/ativos',
            type: 'post',
            dataSrc: ''
        },
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: '<img src="/images/plus.svg">',
            },
            { 
                data: 'codigo',
            },
            {
                data: 'saldo',
                className: "text-right",
            },
            {
                data: 'unitario',
                className: "text-right",
                render: $.fn.dataTable.render.number( '.', ',', 2, 'R$ ' ),
            },
            {
                data: 'retorno',
                className: "text-right",
                render: $.fn.dataTable.render.number( '.', ',', 2,'','%'),
            },
            {
                orderable: false,
                width: "200px", 
                className: "text-center",
                data: null,
                defaultContent: '<button id="btnopcoes" class="btn btn-sm">\
                        Op&ccedil;&otilde;es</button> \
                        <button id="btnaddtrade" class="btn btn-sm">Add Trade</button>',
            }
        ]
    });
 /*  data-toggle='modal' data-target='#TradeModal'   */ 

    // Add event listener for opening and closing details
    $('#ativosList tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = ativosList.row( tr );
 
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child( formatTable( row.data() ) ).show();
            tr.addClass('shown');
        }
    });

    $('#ativosList tbody').on('click', '#btnopcoes', function () {
        $('#OptionsModal').modal('show');
        $('#f2txtativo').val(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#f2txtid').val(ativosList.row( $(this).parents('tr') ).data()._id);
        $('#f2txtsaldo').val(ativosList.row( $(this).parents('tr') ).data().saldo);
        $('#f2txtunitario').val(ativosList.row( $(this).parents('tr') ).data().unitario);
    });

    $('#btnopcoessubmit').click(function() {
        //alert( $('#txtid').val() );
        $('#formEditAtivo').submit();
    });

    $('#ativosList tbody').on('click', '#btnaddtrade', function () {
        $('#TradeModal').modal('show');
        $('#txtativo').val(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#txtid').val(ativosList.row( $(this).parents('tr') ).data()._id);
    });

    $('#btntradesubmit').click(function() {
        $('#formNewTrade').submit();
    });

    $('#btnedittradesubmit').click(function() {
        $('#formEditTrade').submit();
    });

});