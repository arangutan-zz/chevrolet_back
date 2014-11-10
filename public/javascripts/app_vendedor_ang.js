var socket = io.connect('http://192.168.1.106:3001');

var app = angular.module('vendedores', []);

// app.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/', {
//         templateUrl: 'tmpl_vendedores/login.html'
//       }).
//       otherwise({
//         redirectTo: '/phones'
//       });
//   }]);


app.controller('LoginCtr', ['$scope', function($scope) {


  var datos_llamada = null;
  var timer = null;
  $scope.ocupado = false;
  $scope.llamando = false;
  $scope.cedula = '';
  $scope.carro = '';
  $scope.nombre = '';

  //socket.emit('activar_vendedor',{cedula:'222222'});
  //socket.emit('desactivar_vendedor',{concesionario:'542c8076aa653d0000759661', vendedor:'545267cbcb21d88a6ecfbdcf'});


  var guardar_user = function (data) {
    sessionStorage.setItem("cedula", data.vendedor.cedula);
    sessionStorage.setItem("id", data.vendedor._id);
    sessionStorage.setItem("concesionario", data.vendedor.concesionario);
    sessionStorage.setItem("nombre", data.vendedor.name);
  }


  var user_logueado = function () {

    var obj = null;

    if(sessionStorage.getItem("nombre")){
      var obj = {
        id : sessionStorage.getItem("id"),
        cedula : sessionStorage.getItem("cedula") ,
        concesionario: sessionStorage.getItem("concesionario"),
        nombre: sessionStorage.getItem("nombre")
      }
    }

    return obj;

  }


  /*Si esta logueado previamente no muestra la pantalla de login inicial si no muestra la segunda esperando la llamada a vendedor*/
  // if (!user_logueado()) {
  //   socket.emit('activar_vendedor',{cedula:'444444'});
  // }



  socket.on('notify_vendedores',function(data){

    /*
      1:El vendedor existe y devuelve el objeto
      2:El vendedor no se encontro devuelve un mensaje de error
    */

    switch (data.cod){
      case 1:
          console.log(data);

          guardar_user(data);

        break;
      case 2:
          console.log(data);
        break;
      case 3:

        break;
      case 4:

        break;
      default:

      }
    });


  socket.on('notify_sellers', function (data) {

    var user = user_logueado();

    if(user && data.turno._id == user.concesionario && data.turno.cola_vendedores.length > 0){
      console.log('le toca al concesionario');

      if (user.id == data.turno.cola_vendedores[0]) {
          console.log('es su turno');
          console.log(data);

          datos_llamada = data;
          llamando = true;

          timer = TimersJS.oneShot(10000, function() {

            datos_llamada = null;
            llamando = false;


            console.log('---------------------');
            console.log("No atendio la llamada");
            socket.emit('vendedor_noatendio',user);
          });


      }else{
        console.log('pero a otro vendedor');
      }

    }


  });


  $scope.aceptarLlamada = function(){

    //console.log('santiago');

    $scope.nombre = datos_llamada.user.name;
    $scope.carro = datos_llamada.car;

    if (user && datos_llamada) {

      timer.kill();

      var user = user_logueado();

      var obj = {
          tablet_id : datos_llamada.tablet_id,
          vendedor_id : user.id,
          consecionario_id : datos_llamada.turno._id,
          user_id :  datos_llamada.user._id,
          car : datos_llamada.car
      }

      //console.log(datos_llamada);

      /*Marcar en estado ocupado*/

      $scope.ocupado = true;
      socket.emit('seller_acepted',obj);

    }
  }

  $scope.verificarCedula = function(){
    //console.log(user_logueado());
    //console.log();

    socket.emit('activar_vendedor',{cedula: $scope.cedula});

  }

  $scope.volverDisponible = function () {

    var user = user_logueado();
    if (user) {
      socket.emit('activar_vendedor',{cedula: user.cedula});
    }

  }


}]);
