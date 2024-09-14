require('dotenv').config();
const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

const logger = require('./utils/logger')
const connect = require('./db/connect')
const mainRouter = require('./router/mainRouter')
const adminRouter = require('./router/adminRouter')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', path.resolve(__dirname, 'public', 'views'))
// app.enable('view cache');

app.use(cors())

app.use('/avatars', express.static(path.resolve(__dirname, 'public', 'avatars')))
app.use('/views', express.static(path.resolve(__dirname, 'public', 'views')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json({}))
app.use(cookieParser(process.env.SECRET_KEY))
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		maxAge: 7 * 24 * 60 * 60
	},
}))

app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,token");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.use((req, res, next) => {
	const { method, url } = req
	const ip = req.headers['X-Forwarded-For'] || req.socket.remoteAddress
	const host = req.get('host')
	logger.req(method, `ULR: ${host}${url} | IP: ${ip}`)
	next()
})
app.use((req, res, next) => {
	req.hostname.startsWith('admin') ? adminRouter(req, res, next) : mainRouter(req, res, next)
})


app.listen(process.env.PORT, async () => {
	console.clear()
	await connect()
	logger.ok(`index.js`, `Сервер успешно запущен и использует порт ${process.env.PORT}`)
})