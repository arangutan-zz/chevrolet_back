var app = angular.module('Dashboard', []);

app.factory('socket',function(){
	var socket = io.connect('http://192.168.1.106:3001');
	return socket;
});

app.controller('DatosNowCtrl', ['$scope','socket','$http', function($scope,socket,$http) {


	/*Variables*/
	$scope.data = {
		date: '12 NOV',
		in : 100000,
		in_total : 100000,
		calls : 100000,
		sells: 100000,
		consecionario:{
			name: 'Internacional',
			units: 100000
		},
		seller:{
			name: 'Ibra Ramirez',
			units: 100000
		}
	}


	/*Init*/
	$http.get('/dashboard/datos_now').
		success(function(data, status, headers, config) {
			console.log(data);
		  // this callback will be called asynchronously
		  // when the response is available
		}).
		error(function(data, status, headers, config) {
		  // called asynchronously if an error occurs
		  // or server returns response with an error status.
		});

	/*Events*/

	/*Functions*/

}]);
