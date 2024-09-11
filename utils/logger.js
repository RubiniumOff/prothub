class Logger {
	colors = { ok: '32', info: '39', POST: '34', GET: '36', warn: '33', error: '31', fatal: '35', reset: '0' }
	format = { normal: '0', bold: '1', faint: '2', italic: '3', underline: '4', blinking: '5', strike: '9'}
	status = { '200': '32', '400': '33', '401': '33', '403': '33', '404': '33', '500': '35' }

	ok (where, message) {
		console.log(
			`${this.currDate('ok')} ` +
			`${this.color('ok', 'bold')}${where}${this.color('reset')} => ` +
			`${this.color('ok', 'italic')}${message}${this.color('reset')}`
		)
	}

	req (where, message, code = 200) {
		console.log(
			`${this.currDate(where)} `+
			`${this.color(where, 'bold')}${where}${this.statusColor(code)}${this.color('reset')} => ` +
			`${this.color(where, 'italic')}${message}${this.color('reset')}`
		)
	}

	warn (where, message) {
		console.warn(
			`${this.currDate('warn')} ` +
			`${this.color('warn', 'bold')}${where}${this.color('reset')} => ` +
			`${this.color('warn', 'italic')}${message}${this.color('reset')}`
		)
	}

	currDate (color) {
		const now = new Date();

		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = String(now.getFullYear()).slice(-2);
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
		return `${this.color(color)}[${formattedDateTime}]${this.color('reset')}`
	}

	color(clr, type = 'normal') {
		return `\x1b[${this.format[type]};${this.colors[clr]}m`
	}

	statusColor(code) {
		return ` \x1b[1;${this.status[code]}m( ${code} )${this.color('reset')}`
	}
}

const logger = new Logger()

module.exports = logger