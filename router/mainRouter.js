const { Router } = require('express')
const router = new Router()
const bcrypt = require('bcrypt')

const logger = require('../utils/logger')
const videoModel = require('../models/videoModel')

router.get('/', (req, res) => {
	res.redirect('https://1wbhk.com/casino/list?open=register&p=ilnd')
})

router.get('/:slink', async (req, res) => {
	const isSLink = await videoModel.findOne({ slink: req.params.slink })
	if (isSLink) {
		return res.render('password', {slink: req.params.slink})
	}

	const isUuid = await videoModel.findOne({ uuid: req.params.slink })
	if (isUuid) return res.render('home', { uuid: isUuid.uuid, vlink: isUuid.vlink })

	res.redirect('https://1wbhk.com/casino/list?open=register&p=ilnd')
})
router.post('/password', async (req, res) => {
	const { slink, pwd } = req.body
	if (!slink || !pwd) return console.log(req.body)

	const video = await videoModel.findOne({ slink })
	if (!video) return res.status(403).json({ result: false })

	if (video.pwd !== pwd) return res.status(403).json({ result: false })

	res.status(200).json({ result: true, uuid: video.uuid})
})

router.get('/video/:id', async (req, res) => {
	const { report } = req.query
	const { id } = req.params
	if (report === 'error') {
		logger.warn('video report', `Видео ${id} не загружается`)
		await videoModel.findOneAndUpdate({ uuid: id }, { lastLoadStatus: false, isView: true })
		res.status(200).json()
	} else if (report === 'view') {
		logger.ok('video report', `Видео ${id} успешно загружено`)
		await videoModel.findOneAndUpdate({ uuid: id }, { isView: true })
	}
})

module.exports = router