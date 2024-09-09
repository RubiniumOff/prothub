require('dotenv').config();
const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const app = express()

const connect = require('./db/connect')
const mainRouter = require('./router/mainRouter')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', path.resolve(__dirname, 'public', 'views'))
// app.enable('view cache');

app.use(express.static(path.resolve(__dirname, 'public', 'views')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}))

app.use(mainRouter)

app.listen(process.env.PORT, async () => {
	console.clear()
	await connect()
	console.log(`Сервер успешно запущен и использует порт ${process.env.PORT}`)
})