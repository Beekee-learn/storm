import Vue from 'vue'
import moment from 'moment'
import { io } from 'socket.io-client'

let hote = 'http://localhost:3000'
if (process.env.PORT) {
	hote = 'http://localhost:' + process.env.PORT
}
if (process.env.NODE_ENV === 'production') {
	hote = process.env.DOMAIN
}

Vue.prototype.$formaterDate = function (date, langue) {
	let dateFormattee = ''
	switch (langue) {
	case 'fr':
		dateFormattee = moment(date).locale('fr').format('L') + ' à ' + moment(date).locale('fr').format('LT')
		break
	case 'en':
		dateFormattee = moment(date).locale('en').format('L') + ' at ' + moment(date).locale('en').format('LT')
		break
	case 'es':
		dateFormattee = moment(date).locale('es').format('L') + ' a las ' + moment(date).locale('es').format('LT')
		break
	case 'it':
		dateFormattee = moment(date).locale('it').format('L') + ' alle ' + moment(date).locale('it').format('LT')
		break
	}
	return dateFormattee
}

Vue.prototype.$socket = io(hote, {
	transports: ['websocket', 'polling'],
	closeOnBeforeunload: false
})

Vue.prototype.$verifierEmail = function (email) {
	const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi
	return regexExp.test(email)
}
