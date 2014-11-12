var app = angular.module('Dashboard', []);

app.factory('socket',function(){
	var socket = io.connect('http://192.168.1.106:3001');
	return socket;
});

app.controller('DatosNowCtrl', ['$scope','socket', function($scope,socket) {



}]);
