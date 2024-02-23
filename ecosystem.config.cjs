module.exports = {
	apps: [{
    	name: 'Digistorm',
    	script: 'npm -- run server:prod',
		autorestart: true,
		max_restarts: 10
	}]
}
