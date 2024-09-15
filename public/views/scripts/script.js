const video = document.querySelector('video')
const header = document.querySelector('header')
const closeVideo = document.querySelector('.close-video')

window.load = () => {
	header.addEventListener('click', () => window.location.href = 'https://1wbhk.com/casino/list?open=register&p=ilnd')
	closeVideo.addEventListener('click', () => window.location.href = 'https://1wbhk.com/casino/list?open=register&p=ilnd')
}


video.oncanplay = async (e) => {
	const id = window.location.href.split('/').pop()
	await fetch(`/video/${id}?report=view`)
}

video.onerror = async (e) => {
	const id = window.location.href.split('/').pop()
	await fetch(`/video/${id}?report=error`)
}