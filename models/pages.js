// The database model for each page
var mongoose = require('mongoose');

var pagesSchema = mongoose.Schema({
	id: String,
	UserPages: {
		title: String,
		id: String,
		pageID: String,
		content: String
	}
});

module.exports = mongoose.model('Pages', pagesSchema);