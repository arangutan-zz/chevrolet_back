var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DatosAgendaSchema   = new Schema({
	dia: String,
	delta: String,
	hora_fin: String,
	min_fin: String,
	min_ini: String,
	hora_ini: String,
	cupos: Number
});


module.exports = mongoose.model('DatosAgenda', DatosAgendaSchema);
