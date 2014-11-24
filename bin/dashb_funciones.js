var Cliente = require('../models/cliente');
var Vendedor = require('../models/vendedor');
var Concesionario = require('../models/concesionario');
var Dashboard = require('../models/dashboard');
var Vendido = require('../models/carro_mas_vendido');
var Consultado = require('../models/carro_mas_consultado');
var Agenda = require('../models/agenda');
var async =  require('async');

var io = require('../bin/www');


var obtenerFechaString = function(){
  var d = new Date();
  return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
}


var crear_dashboard =  function(){
  var dashboard = new Dashboard({
    day: obtenerFechaString(),
    fecha:  Date()
  }).save(function (err, obj) {
    if (err) return console.error(err);
      console.log(obj);
  });
}

var obtener_dashboard =  function(fecha){

  if (fecha === 'hoy') {
    fecha = obtenerFechaString()
  }

  Dashboard.findOne({day : fecha}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){

        return dashboard;
        //no se pudo guardar

    }else{
      //no se encontro para aumentar
    }

  });
}


var calcular_vendedor_mas_ventas = function(fecha){

  Vendedor.find({ 'ventas.day': fecha })
      .select('name num_ventas')
      .sort({'num_ventas': 'desc'})
      .exec(function(err,vendedores){
    if (err) {return console.log("error");};

    if (vendedores) {
      console.log(vendedores);

      //if (res[0]) {
        Dashboard.update({day:fecha}, { $set: { 'vendedor_ventas.name': vendedores[0].name ,'vendedor_ventas.units': vendedores[0].num_ventas  }}, function(err,obj){
            console.log(vendedores[0]);
        });
      //}

    } else{

    };
  });
}

var calcular_consecionario_mas_ventas = function(fecha){
  Vendedor.aggregate(
    { $group:
      { _id: '$concesionario_name', total_sells: { $sum: "$num_ventas" } }
    },
    {
      $sort: {total_sells: -1}
    },
    {
      $limit : 1
    },
    function (err, res) {
      if (err) return handleError(err);
      console.log(res);

      if (res[0]) {
        Dashboard.update({day:fecha}, { $set: { 'concesionario_ventas.name': res[0]._id ,'concesionario_ventas.units': res[0].total_sells  }}, function(err,obj){
            console.log(res[0]);
        });
      }
    }
  );
}



var aumentar_vendidos = function(carro,id_user,id_vendidos,io){

  var fecha = obtenerFechaString();

  Dashboard.findOne({day : fecha}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){
      dashboard.total_sells = dashboard.total_sells + 1;

      dashboard.save(function(err,dashb){
        //no se pudo guardar

        if (dashb) {
          var consultado = new Vendido({
            dia: fecha,
            carro:  carro,
            usuario: id_user,
            vendedor: id_vendidos
          }).save(function (err, obj) {
            if (err) return console.error(err);
              console.log(obj);

              async.parallel({
                one: function(callback){
                    calcular_consecionario_mas_ventas(fecha);
                    setTimeout(function(){
                        callback(null, 'done');
                    }, 1000);
                },
                two: function(callback){
                    calcular_vendedor_mas_ventas(fecha);
                    setTimeout(function(){
                        callback(null, 'done');
                    }, 1000);
                },
                tree: function(callback){
                    obtener_carro_mas_vendido_especifico('hoy');
                    setTimeout(function(){
                        callback(null, 'done');
                    }, 1000);
                }
            },
            function(err, results) {
              console.log(results);
              actualizar_dashboard();
                // results is now equals to: {one: 1, two: 2}

            });

          });
        }

      });

    }else{
      //no se encontro para aumentar
    }

  });

}


var guardar_in_out = function (enter,out) {
  // body...
  console.log("Actualizar");
  Dashboard.update({day:obtenerFechaString()}, { $set: { 'enter': enter ,'out': out  }}, function(err,obj){
      actualizar_dashboard(io.io);
  });

}


var obtener_carro_mas_vendido_especifico = function(fecha){

  if (fecha === 'hoy') {
    fecha = obtenerFechaString()
  }

  Vendido.aggregate(
    {
      $match: {dia: ''+fecha}
    },
    { $group:
      { _id: '$carro', total_sells: { $sum: 1 } }
    },
    {
      $sort: {total_sells: -1}
    },
    {
      $limit : 1
    },
    function(err,res){

      if (res[0]) {
        Dashboard.update({day:fecha}, { $set: { 'carro_vendido.name': res[0]._id ,'carro_vendido.units': res[0].total_sells  }}, function(err,obj){
            console.log(res[0]);
        });
      }

  })
}

var obtener_carro_mas_consultado_especifico = function(fecha,callback){

  if (fecha === 'hoy') {
    fecha = obtenerFechaString()
  }

  Consultado.aggregate(
    {
      $match: {dia: ''+fecha}
    },
    { $group:
      { _id: '$carro', total_calls: { $sum: 1 } }
    },
    {
      $sort: {total_calls: -1}
    },
    {
      $limit : 1
    },
    function(err,res){

      if (res[0]) {
        Dashboard.update({day:fecha}, { $set: { 'carro_consultado.name': res[0]._id ,'carro_consultado.units': res[0].total_calls  }}, function(err,obj){
            console.log(res[0]);

            if (callback) {
              callback();
            }

        });
      }

    }
  )
}


var aumentar_llamadas = function(carro,id_user,callback){

  console.log('el carro consultado es '+carro);

  var fecha = obtenerFechaString();
  console.log('la fecha es '+fecha );

  Dashboard.findOne({day : fecha}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){
      dashboard.calls = dashboard.calls + 1;

      dashboard.save(function(err,dashb){
        //no se pudo guardar
        if (dashb) {
          // if (callback) {
          //   callback();
          // }
          var consultado = new Consultado({
            dia: fecha,
            carro:  carro,
            id_user: id_user
          }).save(function (err, obj) {
            if (err) return console.error(err);
              obtener_carro_mas_consultado_especifico('hoy',callback);
          });

        }
      });

    }else{
      //no se encontro para aumentar
    }

  });

}

var actualizar_dashboard = function () {
  console.log('actualizar dashboard');

  Dashboard.findOne({day : obtenerFechaString()}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){
        //return dashboard;
        io.io.sockets.emit('actualizacion_dashboard', {dashboard: dashboard});
    }

  });

}


exports.actualizar_dashboard = actualizar_dashboard;
exports.crear_dashboard = crear_dashboard;
exports.obtenerFechaString = obtenerFechaString;
exports.obtener_dashboard = obtener_dashboard;
exports.aumentar_llamadas = aumentar_llamadas;
exports.aumentar_vendidos = aumentar_vendidos;
exports.calcular_consecionario_mas_ventas = calcular_consecionario_mas_ventas;
exports.calcular_vendedor_mas_ventas = calcular_vendedor_mas_ventas;
exports.obtener_carro_mas_vendido_especifico = obtener_carro_mas_vendido_especifico;
exports.obtener_carro_mas_consultado_especifico = obtener_carro_mas_consultado_especifico;
exports.guardar_in_out = guardar_in_out;
