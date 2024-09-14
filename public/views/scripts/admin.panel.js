const links = document.querySelectorAll('aside a')

for (let link of links) {
	if (window.location.pathname === link.getAttribute('href')) {
		link.classList.add('active')
	}
}