class Toaster {
	toastContainer = document.querySelector('#toaster')
	success(message, title = '') {
		this.drawToast('success', message, title)
	}

	error(message, title = '') {
		this.drawToast('error', message, title)
	}

	drawToast(type, message, title) {
		const tBody = document.createElement('div')
		const tTitle = document.createElement('h4')
		const tText = document.createElement('p')

		tBody.classList.add(type)
		tBody.setAttribute('data-time', Date.now() + 3000)
		tBody.setAttribute('data-hover', 'false')
		tTitle.innerText = title
		tText.innerText = message

		this.toastContainer.appendChild(tBody)
		title ? tBody.appendChild(tTitle) : null
		tBody.appendChild(tText)

		setTimeout(() => tBody.classList.add('visible'), 300)

		// const destroyToastAnim = setTimeout(() => tBody.classList.remove('visible'), 2700)
		// const destroyToast = setTimeout(() => tBody.remove(), 3000)

		tBody.addEventListener('mouseenter', () => {
			tBody.setAttribute('data-hover', true)
		})

		tBody.addEventListener('mouseleave', () => {
			tBody.setAttribute('data-hover', false)
			tBody.setAttribute('data-time', Date.now() + 1000)
		})

		tBody.addEventListener('click', () => {
			tBody.classList.remove('visible')
			setTimeout(() => { tBody.remove() }, 300)
		})
	}
}

setInterval(() => {
	const toasts = document.querySelectorAll('#toaster div')

	for (let item of toasts) {
		const timeDiff = item.dataset.time - Date.now()
		const isHover =  item.dataset.hover === 'true'

		console.log(isHover)

		if (timeDiff <= 0 && !isHover) {
			item.classList.remove('visible')
			setTimeout(() => item.remove(), 300)
		}
	}
}, 1000)

export default new Toaster()