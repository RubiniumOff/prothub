const { Schema, model } = require('mongoose')

const Admin = new Schema({
	email: String,
	username: String,
	secret: String,
	ip: {
		type: [String],
		default: []
	},
	authenticateLogs: {
		type: [{ ts: String, ip: String }],
		default: []
	}
})

module.exports = model('admin', Admin)