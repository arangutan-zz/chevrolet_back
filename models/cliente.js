var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClienteSchema   = new Schema({
	name: {type :String, required: true },
	dni:  {type: String } ,
	celphone: {type: String },
	correo :  {type: String },
	estado : { type: String, default: "nocomprador" },
	comprado : { type: String, default: "NA" },
	consulta : [String]
});


module.exports = mongoose.model('Cliente', ClienteSchema);