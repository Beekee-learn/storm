<template>
	<div id="app">
		<a id="beekeebox-home" href="https://demo.beekee.ch" style="display:block;padding:7px;background-color:white;border-width: 0 1px 1px 1px;border-style: solid;border-color:#d6dce8; border-radius:0 0 5px 5px;position:fixed;top:0;left:50%;transform: translate(-50%, 0);z-index:5000;box-shadow:0 3px 5px 1px rgba(35, 35, 193, 0.08)">
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 20 17.8" style="width:17px; enable-background:new 0 0 20 17.8;">
				<path fill="#007BFF" d="M17.8,10l0,5.6c0,0.1,0,0.2,0,0.3v0.6c0,0.8-0.6,1.4-1.4,1.4h-0.6c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0h-2 c-0.8,0-1.4-0.6-1.4-1.4v-3.1c0-0.6-0.5-1.1-1.1-1.1H8.9c-0.6,0-1.1,0.5-1.1,1.1v3.1c0,0.8-0.6,1.4-1.4,1.4H4.4c-0.1,0-0.1,0-0.2,0 c0,0-0.1,0-0.1,0H3.6c-0.8,0-1.4-0.6-1.4-1.4v-3.9c0,0,0-0.1,0-0.1V10H1.1C0.5,10,0,9.5,0,8.9C0,8.6,0.1,8.3,0.3,8l8.9-7.8 C9.5,0,9.8,0,10,0s0.5,0.1,0.7,0.2l3.7,3.3V2.2c0-0.6,0.5-1.1,1.1-1.1h1.1c0.6,0,1.1,0.5,1.1,1.1v4.2L19.6,8C19.9,8.3,20,8.6,20,8.9 c0,0.6-0.5,1.1-1.1,1.1H17.8z"/>
			</svg>
		</a>
		<transition name="fondu">
			<nuxt v-if="!chargement" />
		</transition>

		<div id="conteneur-message" class="conteneur-modale" v-if="message">
			<div id="message" class="modale">
				<div class="conteneur">
					<div class="contenu">
						<div class="message" v-html="message" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="reinitialiserMessage">{{ $t('fermer') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Base',
	data () {
		return {
			chargement: true
		}
	},
	computed: {
		message () {
			return this.$store.state.message
		},
		notification () {
			return this.$store.state.notification
		}
	},
	watch: {
		notification: function (notification) {
			if (notification !== '') {
				const element = document.createElement('div')
				const id = 'notification_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
				element.id = id
				element.textContent = notification
				element.classList.add('notification')
				document.querySelector('#app').appendChild(element)
				this.$store.dispatch('modifierNotification', '')
				setTimeout(function () {
					element.parentNode.removeChild(element)
				}, 2500)
			}
		}
	},
	mounted () {
		this.chargement = false
	},
	methods: {
		reinitialiserMessage () {
			this.$store.dispatch('modifierMessage', '')
		}
	}
}
</script>
