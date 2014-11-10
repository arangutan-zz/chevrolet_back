var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AgendaSchema   = new Schema({
	dia: String,
	hora: String,
	cliente: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'}
});


module.exports = mongoose.model('Agenda', AgendaSchema);
