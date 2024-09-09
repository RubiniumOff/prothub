const { mongoose } = require('mongoose')

module.exports = async () => {
	try {
		await mongoose.connect(`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
		console.log('Подключение к БД успешно')
	} catch (e) {
		console.error('Ошибка подключения БД')
		console.error(e)
	}
}