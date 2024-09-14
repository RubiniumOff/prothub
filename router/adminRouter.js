const { Router } = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const videoModel = require('../models/videoModel')
const adminModel = require('../models/adminModel')
const logger = require('../utils/logger')

router.post('/auth', async (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

	const { email, password } = req.body
	if (!email || !password) {
		logger.req('POST', 'Не пришла информация о логине или пароле', 400)
		return res.status(400).json({result: false, message: 'Не указан логин или пароль'})
	}

	const user = await adminModel.findOne({ email })
	if (!user) {
		logger.req('POST', `Попытка авторизации используя не существующий в БД email: ${email}`, 401)
		return res.status(401).json({result: false, message: 'Не правильно указа логин или пароль'})
	}

	const isValidePass = await bcrypt.compare(password, user.secret)
	if (!isValidePass) {
		logger.req('POST', `Введен не верный пароль email: ${email}`, 401)
		return res.status(401).json({result: false, message: 'Не правильно указан логин или пароль'})
	}

	if (!user.ip.includes(ip)) logger.warn('POST', `вход с нового IP: ${ip} email: ${email}`)

	const token = await jwt.sign({
		id: user.id,
		username: user.username,
		avatar: user.avatar
	}, process.env.SECRET_KEY, {
		expiresIn: '7d'
	})

	await user.updateOne({ $push: { authenticateLogs: { ts: Date.now(), ip } } })
	await user.updateOne({ $push: { ip }})

	res.cookie('token', token, {maxAge: 7 * 24 * 60 * 60, httpOnly: true})

	logger.req('POST', `Авторизация успешна. Куки и токен созданы. Email: ${email}`, 200)

	return res.json({ result: true, message: 'Успешно авторизован' })
})
router.use(async (req, res, next) => {
	const { token } = req.cookies

	if (!token) {
		logger.req('GET', 'Администратор не авторизован')
		return res.render('admin', { isAuth: false, layout: 'admin' })
	}

	try {
		const tokenData = await jwt.verify(token, process.env.SECRET_KEY)
		if (!tokenData?.id) {
			logger.req('GET', 'Токен истек или невалиден')
			return res.render('admin', { isAuth: false, layout: 'admin' })
		}

		const sign = await jwt.sign(
			{
				id: tokenData.id,
				username: tokenData.username,
				avatar: tokenData.avatar
			},
			process.env.SECRET_KEY,
			{ expiresIn: '7d' }
		)

		logger.req('GET', 'Создан новый токен')

		res.cookie('token', sign, {maxAge: 7 * 24 * 60 * 60, httpOnly: true})

		logger.req('POST', 'Администратор прошел без авторизации')

		res.locals.tokenData = tokenData

		return next();
	} catch (e) {
		logger.req('GET', 'Catch. Токен истек или невалиден')
		return res.render('admin', { isAuth: false, layout: 'admin' })
	}
})

router.get('/', async (req, res) => {
	const {username, avatar} = res.locals.tokenData

	const allVideoCount = await videoModel.find({}).countDocuments()
	const errorVideoCount = await videoModel.find({lastLoadStatus: false, isView: true}).countDocuments()
	const normalVideoCount = await videoModel.find({lastLoadStatus: true, isView: true}).countDocuments()
	const noViewVideoCount = await videoModel.find({isView: false}).countDocuments()

	res.render('admin', {
		isAuth: true,
		username: username,
		avatar: `http://${req.get('host')}/avatars/${avatar}.svg`,
		layout: 'admin',
		window: () => 'page/admin/main',
		videoStats: {
			all: allVideoCount,
			error: errorVideoCount,
			normal: normalVideoCount,
			noView: noViewVideoCount
		}
	})
})

router.get('/videos', (req, res) => {
	const {username, avatar} = res.locals.tokenData

	res.render('admin', {
		isAuth: true,
		username: username,
		avatar: `http://${req.get('host')}/avatars/${avatar}.svg`,
		layout: 'admin',
		window: () => 'page/admin/videos'
	})
})

router.get('/admins', (req, res) => {
	const {username, avatar} = res.locals.tokenData

	res.render('admin', {
		isAuth: true,
		username: username,
		avatar: `http://${req.get('host')}/avatars/${avatar}.svg`,
		layout: 'admin',
		window: () => 'page/admin/admins'
	})
})

module.exports = router