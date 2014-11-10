$(function(){

    var socket = io.connect('http://192.168.1.100:3001');

    $('#send').on('click',function(){


        if ($('.user_new').hasClass('btn_activo_user_tombola')) {

            

            var carro = $('#carro_compro').val();
            var dni_u  = $('#cedula_new').val();
            var celular_u  = $('#telefono_new').val();
            var correo_u  = $('#correo_new').val();
            var nombre_u  = $('#nombre_new').val();
            var dni_v = $('#cedula_vendedor').val();

            

            if ( dni_u != '' && celular_u != '' && correo_u != '' && nombre_u != '' && dni_v != '' && carro != '') {
                var datos = {
                    dni_user : dni_u,
                    celphone_user : celular_u,
                    email_user : correo_u,
                    name_user : nombre_u,
                    dni_seller: dni_v,
                    car: carro   
                }
                
                //console.log(obj);
                socket.emit('aprobar_compra_new',datos);
            }else{
                alert('por favor completa todos los campos');
            }


        } else{
            var carro = $('#carro_compro').val();
            var dni_u  = $('#cedula_old').val();
            var dni_v = $('#cedula_vendedor').val();

             if ( carro != '' && dni_u != '' && dni_v != '') {
                 var datos = {
                    dni_seller: dni_v,
                    dni_user : dni_u,
                    car: carro
                }
                socket.emit('aprobar_compra',datos);
            }else{
                alert('por favor completa todos los campos');
            }
           
        };

        /*
        var carro = $('#carro_compro').val();
        var dni_u  = $('#cedula').val();

        if ( carro != '' && dni_u != '') {
            var datos = { car: carro ,dni: dni_u };
            socket.emit('aprobar_compra',datos);
        }else{
            alert('por favor completa todos los campos');
        }
        */
    });

 
    socket.on('mensaje_compra', function (data) {
        console.log(data);
        
        switch(data.cod){
            case 1:
                $('#carro_compro').val('');
                $('#cedula').val('');
                alert(data.msg);
            break;
            case 2:
                alert(data.msg);
            break;
        }
    });

    $('.user_new').on('click',function(){
        if (!$(this).hasClass('btn_activo_user_tombola')) {
            $('.user_old').removeClass('btn_activo_user_tombola');
            $(this).addClass('btn_activo_user_tombola');

            //mostrar campos
            $('.campos_user_new').show();
            $('.campos_user_old').hide();
        };
    }); 

    $('.user_old').on('click',function(){
        if (!$(this).hasClass('btn_activo_user_tombola')) {
            $('.user_new').removeClass('btn_activo_user_tombola');
            $(this).addClass('btn_activo_user_tombola');
        
            //mostrar campos
            $('.campos_user_new').hide();
            $('.campos_user_old').show();
        };
    }); 

});
