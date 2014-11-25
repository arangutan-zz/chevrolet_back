window.onload = function() {

    var socket = io.connect('http://10.102.0.15:3001');

    socket.on('notify_tv', function (data) {

        console.log('Se llamo a un vendedor');
        console.log(data);

        var template = '<div class="item">'+
                          '<div class="logo_chevrolet" style="width:100%">'+
                            '<div class="row">'+
                              '<div class="columns large-7">'+
                                '<h5>VENDEDOR:</h5>'+
                               <!-- '<h3>'+data.vendedor.name+'</h3>'+ -->
				'<h3>Vendedor '+''+data.turno.cupos_usados+'</h3>'+
                              '</div>'+
                            '<div class="columns large-5">'+
                             '<h5>COMPRADOR:</h5>'+
                               '<h3>'+data.user.name+'</h3>'+
                              '</div>'+
                            '</div>'+
                            '<div class="row">'+
                              '<div class="columns large-5">'+
                                '<h5>DESTINO:</h5>'+
                                '<h3>'+data.car+'</h3>'+
                              '</div>'+
				'<div class="columns large-5">'+
					'<h5>CONCESIONARIO:</h5>'+
					'<h3>'+data.turno.name+'</h3>'+
				'</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>';

        $('.lista_peticiones').prepend(template);

    });

}
