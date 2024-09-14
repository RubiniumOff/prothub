import toaster from './toaster.mjs'

const loginEmailInput = document.querySelector('#passwordForm .login-input input');
const loginPassInput = document.querySelector('#passwordForm .password-input input');
const passwordForm = document.querySelector('#passwordForm');

function handlePlaceholderEmail(e) {
	const placeholder = document.querySelector('#passwordForm .login-input .placeholder')
	loginEmailInput.focus();
	placeholder.classList.add('open')
}

loginEmailInput.addEventListener('click', handlePlaceholderEmail)
loginEmailInput.addEventListener('focus', handlePlaceholderEmail)

loginEmailInput.addEventListener('blur', () => {
	const placeholder = document.querySelector('#passwordForm .login-input .placeholder')
	if (loginEmailInput.value !== '') return false
	placeholder.classList.remove('open')
})


function handlePlaceholderPassword(e) {
	const placeholder = document.querySelector('#passwordForm .password-input .placeholder')
	loginPassInput.focus();
	placeholder.classList.add('open')
}

loginPassInput.addEventListener('click', handlePlaceholderPassword)
loginPassInput.addEventListener('focus', handlePlaceholderPassword)

loginPassInput.addEventListener('blur', () => {
	const placeholder = document.querySelector('#passwordForm .password-input .placeholder')
	if (loginPassInput.value !== '') return false
	placeholder.classList.remove('open')
})

passwordForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const resp = await fetch('/auth', {
		method: 'post',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: loginEmailInput.value, password: loginPassInput.value })
	})

	const json = await resp.json()

	if (json.result) return window.location.reload()
	else {
		noAccessAnimation()
		toaster.error(json.message)
	}

	return false;
})

function noAccessAnimation() {
	const form_container = passwordForm.querySelector('.form-container');
	form_container.classList.add('error')
	setTimeout(() => {
		form_container.classList.remove('error')
	}, 1000)
}