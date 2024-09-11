const nodemailer = require('nodemailer');

// Создание транспорта для отправки писем
let transporter = nodemailer.createTransport({
	host: 'protakhub.com', // Ваш домен
	port: 25, // Порт SMTP
	secure: false, // true для 465, false для других портов
	auth: {
		user: 'mailer', // Ваш email
		pass: 'e6A8ujREcFV2PakYpd9TWq' // Ваш пароль
	},
	tls: {
		rejectUnauthorized: false
	}
});

// Настройки письма
let mailOptions = {
	from: 'Protakhub.com', // Отправитель
	to: 'dench.240@yandex.ru', // Получатель
	subject: 'Hello', // Тема письма
	text: 'Hello world!', // Текст письма
	html: '<b>Hello world!</b>' // HTML текст письма
};

// Отправка письма
transporter.sendMail(mailOptions, (error, info) => {
	if (error) {
		return console.log(error);
	}
	console.log('Email sent: ' + info.response);
});