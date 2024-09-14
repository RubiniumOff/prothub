const { Schema, model } = require('mongoose')

const Video = new Schema({
	uuid: String,
	vlink: String,
	slink: String,
	pwd: String,
	lastLoadStatus: {
		type: Boolean,
		default: true
	},
	isView: {
		type: Boolean,
		default: false
	}
})

module.exports = model('video', Video)