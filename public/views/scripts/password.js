const passwd = document.querySelector('#passwd')
const passSendBtn = document.querySelector('#passSendBtn')

passSendBtn.addEventListener('click', async (e) => {
	try {
		const urlArr = document.location.href.split('/')
		const slink = urlArr[urlArr.length - 1]

		const resp = await fetch('/password', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd: passwd.value, slink })
		})
		const json = await resp.json()

		console.log(json)

		if (json.uuid) return window.location.href = `/${json.uuid}`
		if (!json.result) {
			passwd.classList.add('error')
			setTimeout(() => {
				passwd.classList.remove('error')
			}, 2000)
		}
	} catch (e) {
	}
})
