const { mongoose } = require('mongoose')
const logger = require('../utils/logger')

module.exports = async () => {
	try {
		const baseConnect = process.env.DB_PASS ?
			`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` :
			`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

		await mongoose.connect(baseConnect)
		logger.ok(`connect.js`, `Подключение к ${process.env.DB_PASS ? `продакшен` : `локальной`} БД успешно`)
	} catch (e) {
		console.error('Ошибка подключения БД')
		console.error(e)
	}
}