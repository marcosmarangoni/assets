
/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row
    let t =  '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;width:100%;">';
    let tipo;
    d.forEach(element => {
        switch(element.tipo) {
            case "c": 
                tipo = "Compra";
                break;
            case "v":
                tipo = "Venda"
                break;
            case "p":
                tipo = "Patrimonio"
                break;
            case "d":
                tipo = "Dividendo."
                break;
        }
        t +=   '<tr><td>'+tipo+'</td>'+            
                    '<td>'+element.date+'</td>'+
                    '<td>'+Number(element.value).toFixed(2)+'</td></tr>';
    });
    t += '</table>';
    return t;
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
                defaultContent: '+',
            },
            { 
                data: 'codigo',
            },
            {
                data: 'saldo',
            },
            {
                data: 'unitario',
                render: $.fn.dataTable.render.number( '.', ',', 2, 'R$' ),
            },
            {
                data: 'retorno',
                render: $.fn.dataTable.render.number( '.', ',', 2),
            },
            {
                orderable: false,
                width: "15%", 
                data: null,
                defaultContent: "<button id='btnopcoes' class='btn btn-sm'>"+
                        "Op&ccedil;&otilde;es</button> "+
                    "<button id='btnaddtrade' class='btn btn-sm'>Add Trade</button>",
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
            row.child( format(row.data().trade) ).show();
            tr.addClass('shown');
        }
    });

    $('#ativosList tbody').on('click', '#btnopcoes', function () {
        //var data = ativosList.row( $(this).parents('tr') ).data();
        alert("ID: "+ativosList.row( $(this).parents('tr') ).data()._id);
    });

    $('#ativosList tbody').on('click', '#btnaddtrade', function () {
        //var data = ativosList.row( $(this).parents('tr') ).data();
        //alert(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#TradeModal').modal('show');
        $('#txtativo').val(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#txtid').val(ativosList.row( $(this).parents('tr') ).data()._id);
    });

    $('#btntradesubmit').click(function() {
        alert( $('#txtid').val() );
        $('#formNewTrade').submit();
    });




});