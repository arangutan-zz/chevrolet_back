window.onload = function() {

    //var messages = [];
    var socket = io.connect('http://10.102.0.15:3001');
    //var field = document.getElementById("field");
    //var sendButton = document.getElementById("send");
    //var content = document.getElementById("content");
    //var name = document.getElementById("name");

    socket.on('notify_tv', function (data) {

        /*
            car: "Camaro"tablet_id: "Rup6cFhiQQs6PR0pAAAB"turno: Object__v: 0_id: "542c8076aa653d0000759661"atendiendo: trueestado: "activo"name: "Autoniza"turno: 1username: "autoniza"
        */




        console.log('Se llamo a un vendedor');
        console.log(data);
        // var template = '<div class="item">'+
        //     '<div class="logo_chevrolet">'+
        //         '<h1 class="subtitle_apptv">CONCESIONARIO</h1>'+
        //         '<h1 class="title_apptv concesionario">'+data.turno.name+'</h1>'+
        //     '</div>'+
        //     '<div class="logo_chevrolet text-right">'+
        //         '<h1 class="subtitle_apptv">DESTINO</h1>'+
        //         '<h1 class="title_apptv carro">'+data.car+'</h1>'+
        //     '</div>'+
        // '</div>';

        var template = '<div class="item">'+
                          '<div class="logo_chevrolet" style="width:100%">'+
                            '<div class="row">'+
                              '<div class="columns large-7">'+
                                '<h5>VENDEDOR:</h5>'+
                                '<h3>MARIO VARGAS HIGUAÍN</h3>'+
                              '</div>'+
                              '<div class="columns large-5">'+
                                '<h5>COMPRADOR:</h5>'+
                                '<h3>'+data.user.name+'</h3>'+
                              '</div>'+
                            '</div>'+
                            '<div class="row">'+
                              '<div class="columns large-7">'+
                                '<h5>CONCESIONARIO:</h5>'+
                                '<h3>'+data.turno.name+'</h3>'+
                              '</div>'+
                              '<div class="columns large-5">'+
                                '<h5>DESTINO:</h5>'+
                                '<h3>'+data.car+'</h3>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>';

        $('.lista_peticiones').prepend(template);

        /*
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }

        */
    });


    // sendButton.onclick = function() {
    //     socket.emit('call_seller', { car: 'Camaro' });
    // };

}
