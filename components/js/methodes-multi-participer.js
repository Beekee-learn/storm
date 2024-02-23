export default {
	methods: {
		definirReponse (event, indexQuestion) {
			if (this.questions[indexQuestion].option === 'choix-unique' || this.questions[indexQuestion].option === 'texte-court') {
				if (this.reponse[indexQuestion].length > 0) {
					this.reponse[indexQuestion].splice(0, 1)
				}
				this.reponse[indexQuestion].push(event.target.value)
			} else if (this.questions[indexQuestion].option === 'choix-multiples') {
				if (event.target.checked === true) {
					this.reponse[indexQuestion].push(event.target.value)
				} else {
					const index = this.reponse[indexQuestion].indexOf(event.target.value)
					this.reponse[indexQuestion].splice(index, 1)
				}
			}
		},
		modifierIndexQuestion () {
			this.$emit('index')
		},
		afficherSupport () {
			this.$emit('support')
		},
		fermerModale () {
			this.modale = ''
		},
		afficherImage (event, image) {
			this.$emit('image', event, image)
		}
	}
}
