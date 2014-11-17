var app = angular.module('Concesionarios', []);

app.factory('socket',function(){
  var socket = io.connect('http://10.102.0.15:3001');
  return socket;
});

app.filter('validad_concecionario',function () {
  return function(concecionario){
    return concecionario != null ? concecionario : 'No tiene aun asignado' ;
  }
});

app.directive('validarOcupado', function() {
  var //template = '<div class="button">Aceptar Cita</div>'
  //if (agenda.concesionario != null) {
    template = '<h5>Nombre: {{agenda.concesionario.name}}</h5>';
  //}
  return {
    restrict: 'E',
    template: template
  };
});


app.controller('AgendaConcesionarioCtr', ['$scope','socket','$http', function($scope,socket,$http) {

    $scope.agendas = [];
    $scope.id_consecionario = '';

    /*Init*/
    $http.get('/vendedor/agenda_concesionario/11-17-2014').
      success(function(data, status, headers, config) {
        //console.log(data);
        $scope.agendas = data.agenda;

        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    /*Events*/
    $scope.solicitar_hora =  function (item_agenda) {
      if (item_agenda.concesionario == null && item_agenda.cliente == null) {
        //console.log($scope.id_consecionario);
        console.log(angular.element('#id_conce').html());
      }else {
        alert('esta hora ya fue asignada');
      }
    }

    /*Functions*/
    socket.on('notify_concesionario', function (data) {
        console.log('Se creo una hora');
        console.log(data);
    });
}]);
