window.onload = function() {

    var info_cliente = {};


    var user = $('#username').html().trim();
    var id = $('#id').html().trim();
    console.log(user);
    var socket = io.connect('http://192.168.1.107:3001');
    socket.on('notify_sellers', function (data) {

        if (data.turno.username === user ) {
            console.log(data);
            info_cliente = data;

            $('#lista_llamados').append('<div class="elemento_llamado" data-tabletid="'+data.tablet_id+'" data-userid="'+data.user._id+'" data-carname="'+data.car+'">'+
                                            '<h3>Te llaman del '+data.car+'</h3>'+
                                            '<input class="aceptar_llamado" type="button" value="Aceptar">'+
                                            '<input class="cancelar_llamado" type="button" value="Cancelar">'+
                                        '</div>');
        }


    });


    $('body').on('click','.aceptar_llamado',function(){

        var obj = {
            tablet_id : $(this).parent().data('tabletid'),
            vendedor_id : info_cliente.turno._id,
            user_id :  $(this).parent().data('userid'),
            car : $(this).parent().data('carname')
        }

        socket.emit('seller_acepted', obj);

    });

    /*Buscar Vendedor*/

    $('#btn_buscarvendedor').on('click',function(){
        console.log('activar');

        $campo = $('#buscar_vendedor');
        socket.emit('buscar_vendedor', {cedula: $campo.val(), concesionario: user});

    });


    socket.on('vendedor_encontrado', function (data) {
        switch(data.cod){
            case 1:
                console.log(data.data);
                $('.vendedor_encontrado').html('<h3>'+data.data.name+'</h3><input type="submit" id="btn_activarvendedor" value="activar" data-cedula='+data.data.cedula+'>');
            break;
            case 2:
                console.log(data.msg);
            break;
        }
    });

    /*Fin buscar vendedor*/


    /*Activar Vendedor*/

    $('body').on('click','#btn_activarvendedor',function(){
        socket.emit('activar_vendedor', {cedula: $(this).data('cedula'), concesionario: user});
    });

    /*Fin Activar Vendedor*/

    $('body').on('click','.cancelar_llamado',function(){

        $(this).parent().hide();

    });


    /*Obtener Disponibles*/

    $('#btn_numvendedores').on('click',function(){
        //aumentar_ocupados();
        //var num_disponibles = $('#num_disponibles').val().trim();
        socket.emit('obtener_disponibles', {concesionario: id});
    });

    /*Fin Disponibles*/


    /*Disponibles*/

    socket.on('vendedores', function (data) {

        console.log(data);


        var respuesta = _.where(data.vendedores, {asistio: true});

        console.log(respuesta);

        aumentar_ocupados(respuesta.length);

        // switch(data.cod){
        //     case 1:
        //         console.log(data.data);

        //         $('.vendedor_encontrado').html('<h3>'+data.data.name+'</h3><input type="submit" id="btn_activarvendedor" value="activar" data-cedula='+data.data.cedula+'>')

        //     break;
        //     case 2:
        //         console.log(data.msg);
        //     break;
        // }
    });
    /**/


    var aumentar_ocupados = function(num){

        for (var i = parseInt(num)-1; i >= 0; i--) {
            $('.lista_aprobados').append('<div class="circle"><p>santico</p><div>');
        };


        var $campo = $('#num_ocupados');
        $campo.val(parseInt($campo.val())+1);

    }

}
