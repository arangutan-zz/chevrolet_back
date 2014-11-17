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

app.directive('validarOcupado', function($compile) {

  var imageTemplate = '<div class="entry-photo"><h2>&nbsp;</h2><div class="entry-img"><span><a href="{{rootDirectory}}{{content.data}}"><img ng-src="{{rootDirectory}}{{content.data}}" alt="entry photo"></a></span></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
  var btn = '<div class="button">Aceptar hora</div>';
  var concesionario = '<p>Cita aceptada por {{content.concecionario.name}}</p>';


  var linker = function(scope, element, attrs) {

    if (scope.content.concecionario) {
      element.html(concesionario).show();
      $compile(element.contents())(scope);
    }else{
      element.html(btn).show();
    }
      //console.log(scope.content.concecionario);
      //console.log(element);
      //element.html(getTemplate(scope.content.content_type)).show();
      //$compile(element.contents())(scope);
  }

  return {
    restrict: 'E',
    link: linker,
        scope: {
            content:'='
        }
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
      if (item_agenda.concesionario == null) {
        //console.log($scope.id_consecionario);

        var obj = {
          id_agenda : item_agenda._id,
          id_concecionario : angular.element('#id_conce').html().trim()
        }

        socket.emit('seleccionar_hora_atender',obj);

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
