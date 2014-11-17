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


app.factory('socket',function () {
  var socket = io.connect('http://10.102.0.15:3001');  
  return socket;
})


app.controller('LoginCtr', ['$scope','socket', function($scope,socket) {


  //var datos_llamada = null;
  var timer = null;
  $scope.ocupado = false;
  $scope.llamando = false;
  $scope.login = true;
  $scope.tengodato = true;
  $scope.espera = false;
  $scope.cedula = '';
  $scope.carro = '';
  $scope.nombrevendedor = '';
  $scope.nombreusuario ="";
  var datos = {
    nombrevendedor: "",
    carro: "",
    nombreusario: "",
    concesionario: "",
    tablet_id: "", 
    turno_id: "",
    user_id: ""
  };


   //socket.emit('activar_vendedor',{cedula:'222222'});
  //socket.emit('desactivar_vendedor',{concesionario:'542c8076aa653d0000759661', vendedor:'545267cbcb21d88a6ecfbdcf'});




  var guardar_user = function (data) {

    sessionStorage.setItem("cedula", data.vendedor.cedula);
    sessionStorage.setItem("id", data.vendedor._id);
    sessionStorage.setItem("concesionario", data.vendedor.concesionario);
    sessionStorage.setItem("nombre", data.vendedor.name);

    console.log(sessionStorage.getItem("nombre"));
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
  if (user_logueado()) {
     socket.emit('activar_vendedor',{cedula:user_logueado().cedula, consulta: true});
  }



  socket.on('notify_vendedores',function(data){

    /*
      1:El vendedor existe y devuelve el objeto
      2:El vendedor no se encontro devuelve un mensaje de error
      3:El vendedor se deslogueó satisfactoriamente
    */

    switch (data.cod){
      case 1:
          guardar_user(data);
          console.log(data)
          datos.nombrevendedor = user_logueado().nombre;
          $scope.nombrevendedor = datos.nombrevendedor;
          if (!data.vendedor.disponible){
            $scope.tengodato = false;
            $scope.ocupado = true;
            $scope.login = false;
          }else{
            $scope.espera = true;
            $scope.login = false;  
          }
          
          $scope.$digest();
          //console.log($scope.espera);
        break;
      case 2:
          console.log(data);
        break;
      case 3:
          $scope.espera = false;
          $scope.login = true;
          $scope.cedula = '';
          $scope.$digest();
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

          //datos_llamada = data;
          datos.carro = data.car;
          datos.nombreusuario = data.user.name;
          datos.tablet_id = data.tablet_id;
          datos.turno_id = data.turno._id;
          datos.user_id = data.user._id;
          $scope.llamando = true;
          $scope.espera = false;
          $scope.nombreusuario = datos.nombreusuario;
          $scope.carro = datos.carro;
          $scope.$digest();

          timer = TimersJS.oneShot(10000, function() {

            datos.nombreusuario = "";
            datos.tablet_id = "";
            datos.turno_id = "";
            $scope.llamando = false;
            $scope.espera = true;
            $scope.$digest();

            console.log('---------------------');
            console.log("No atendio la llamada");
            socket.emit('vendedor_noatendio',user);
          });


      }else{
        console.log('pero a otro vendedor');
      }

    }


  });


  $scope.aceptarLlamada = function(data){

    //$scope.nombre = datos_llamada.user.name;
    //$scope.carro = datos_llamada.car;
    

    if (user_logueado() && datos.nombreusuario!="") {
      $scope.tengodato = true;
      timer.kill();

      var user = user_logueado();

      var obj = {
          tablet_id : datos.tablet_id,
          vendedor_id : user.id,
          consecionario_id : datos.turno_id,
          user_id :  datos.user_id,
          car : datos.carro
      }

      console.log(datos);

      /*Marcar en estado ocupado*/
      
      $scope.ocupado = true;
      $scope.llamando = false;
      //$scope.$digest();
      socket.emit('seller_acepted',obj);
      
    }
  }

  $scope.verificarCedula = function(){
    //console.log($scope.cedula);
    socket.emit('activar_vendedor',{cedula: $scope.cedula});

  }

  $scope.volverDisponible = function () {

    var user = user_logueado();
    if (user) {
      $scope.ocupado = false;
      $scope.espera = true;
      socket.emit('activar_vendedor',{cedula: user.cedula, again: true});
    }

  }

  $scope.logout_usuario = function (){
    socket.emit('desactivar_vendedor',{concesionario: user_logueado().concesionario, vendedor:user_logueado().id});    
    sessionStorage.clear();
  }


  $scope.rechazarLlamada = function(){
    $scope.llamando = false;
    $scope.espera = true;
  }
}]);
