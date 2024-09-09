const { Schema, model } = require('mongoose')

const Video = new Schema({
	uuid: String,
	vlink: String,
	slink: String,
	pwd: String,
})

module.exports = model('video', Video)