<template>
	<div id="questionnaire">
		<div id="progression" v-if="indexQuestion > -1 && questions.length > 1">
			{{ $t('question') }} {{ indexQuestion + 1 }} / {{ questions.length }}
		</div>
		<div id="progression" v-else-if="indexQuestion === -1 && description !=='' && Object.keys(support).length === 0">
			{{ $t('description') }}
		</div>
		<div id="progression" v-else-if="indexQuestion === -1 && description !=='' && Object.keys(support).length > 0">
			{{ $t('descriptionEtSupport') }}
		</div>

		<div id="support" v-if="indexQuestion > -1 && Object.keys(support).length > 0">
			<span class="bouton" role="button" tabindex="0" @click="afficherSupport">{{ $t('afficherSupport') }}</span>
		</div>

		<div id="description" v-if="description !== '' || Object.keys(support).length > 0" v-show="indexQuestion === -1">
			<div class="description" v-if="description !== ''" v-html="description" />
			<div class="support" v-if="Object.keys(support).length > 0">
				<img v-if="support.type === 'image'" :src="'/fichiers/' + code + '/' + support.fichier" :alt="support.alt" @click="afficherImage($event, '/fichiers/' + code + '/' + support.fichier)">
				<audio v-else-if="support.type === 'audio'" controls :src="'/fichiers/' + code + '/' + support.fichier" />
				<div class="video" v-else-if="support.type === 'video'">
					<iframe :src="support.lien" allowfullscreen />
				</div>
			</div>
		</div>

		<div id="questions" :class="{'avec-progression': indexQuestion > -1 && questions.length > 1}">
			<TransitionGroup name="fondu">
				<div class="q" v-for="(q, indexQ) in questions" v-show="indexQuestion === indexQ" :key="'q_' + indexQ">
					<div :id="'question' + indexQ">
						<div class="question-et-support" v-if="q.question !== '' && Object.keys(q.support).length > 0">
							<span class="question">{{ q.question }}</span>
							<span class="support" @click="afficherImage($event, '/fichiers/' + code + '/' + q.support.image)" :title="$t('afficherImage')"><img :src="'/fichiers/' + code + '/' + q.support.image" :alt="q.support.alt"></span>
						</div>
						<div class="question" v-else-if="q.question !== ''" v-html="q.question" />
						<div class="support" v-else-if="Object.keys(q.support).length > 0">
							<img :src="'/fichiers/' + code + '/' + q.support.image" :alt="q.support.alt" @click="afficherImage($event, '/fichiers/' + code + '/' + q.support.image)" :title="$t('afficherImage')">
						</div>
					</div>

					<div :id="'items' + indexQ" class="items" v-if="q.option !== 'texte-court'">
						<template v-for="(item, index) in q.items">
							<label :id="'item' + indexQ + '_' + index" class="item" :class="{'desactive': reponseEnvoyee[indexQ] === 'reponse-envoyee', 'correct': options.reponses === true && item.reponse === true && reponseEnvoyee[indexQ] === 'reponse-envoyee'}" v-if="item.texte !== '' || item.image !== ''" :key="'item_' + indexQ + '_' + index">
								<span class="icone material-icons" v-if="q.option === 'choix-unique' && !reponse[indexQ].includes(item.texte) && !reponse[indexQ].includes(item.image)">radio_button_unchecked</span>

								<span class="icone material-icons" v-else-if="q.option === 'choix-multiples' && !reponse[indexQ].includes(item.texte) && !reponse[indexQ].includes(item.image)">check_box_outline_blank</span>

								<span class="icone material-icons" v-else-if="q.option === 'choix-unique' && (reponse[indexQ].includes(item.texte) || reponse[indexQ].includes(item.image))">radio_button_checked</span>

								<span class="icone material-icons" v-else-if="q.option === 'choix-multiples' && (reponse[indexQ].includes(item.texte) || reponse[indexQ].includes(item.image))">check_box</span>

								<span class="image" v-if="item.image !== ''" @click="afficherImage($event, '/fichiers/' + code + '/' + item.image)" :title="$t('afficherImage')"><img :src="'/fichiers/' + code + '/' + item.image" :alt="item.alt"></span>

								<span class="texte" v-if="item.texte !== ''">{{ item.texte }}</span>

								<input type="radio" name="item" :value="item.texte" @change="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" style="display: none;" v-if="q.option === 'choix-unique' && item.texte !== ''">

								<input type="checkbox" name="item" :value="item.texte" @change="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" style="display: none;" v-else-if="q.option === 'choix-multiples' && item.texte !== ''">

								<input type="radio" name="item" :value="item.image" @change="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" style="display: none;" v-else-if="q.option === 'choix-unique' && item.image !== ''">

								<input type="checkbox" name="item" :value="item.image" @change="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" style="display: none;" v-else-if="q.option === 'choix-multiples' && item.image !== ''">
							</label>
						</template>
					</div>
					<div :id="'reponses' + indexQ" class="conteneur-textarea" :class="{'correct': verifierReponseTexte(indexQ)}" v-else>
						<TextareaAutosize :rows="2" :min-height="46" :max-height="124" :placeholder="$t('votreReponse')" @input="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" v-if="indexQuestion === indexQ" />
					</div>

					<div class="retroaction" v-if="options.reponses === true && options.retroaction === true && q.hasOwnProperty('retroaction') && (q.retroaction.correcte !== '' || q.retroaction.incorrecte !== '') && reponseEnvoyee[indexQ] === 'reponse-envoyee'">
						<span v-html="q.retroaction.correcte" v-if="definirReponseCorrecte(indexQ) === true" />
						<span v-html="q.retroaction.incorrecte" v-else-if="definirReponseCorrecte(indexQ) === false" />
					</div>

					<div class="actions" v-if="options.progression === 'libre'">
						<span class="bouton bouton-reponse" role="button" tabindex="0" :class="{'desactive': reponse[indexQ].length === 0}" @click="envoyerReponse(indexQ)" v-if="reponseEnvoyee[indexQ] !== 'reponse-envoyee'">{{ $t('envoyer') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="modifierIndexQuestion" v-if="reponseEnvoyee[indexQ] === 'reponse-envoyee' && reponse[indexQ + 1] && reponse[indexQ + 1].length === 0">{{ $t('questionSuivante') }}</span>
					</div>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script>
import linkifyHtml from 'linkify-html'
import TextareaAutosize from '#root/components/textareaAutosize.vue'
import methodes from '#root/components/js/methodes-multi-participer'

export default {
	name: 'QuestionnaireParticiper',
	components: {
		TextareaAutosize
	},
	extends: methodes,
	props: {
		hote: String,
		identifiant: String,
		nom: String,
		code: String,
		donnees: Object,
		reponses: Array,
		statut: String,
		session: Number,
		indexQuestion: Number,
		date: Number,
		validation: String,
		reponseEnvoyee: Array
	},
	data () {
		return {
			description: '',
			support: {},
			options: {},
			questions: [],
			reponse: [],
			temps: []
		}
	},
	watch: {
		validation: function (valeur) {
			if (this.options.progression === 'animateur' && valeur === 'validation' && this.options.points === 'classique') {
				this.$emit('validation', { reponse: this.reponse, identifiant: this.identifiant, nom: this.nom })
			} else if (this.options.progression === 'animateur' && valeur === 'validation' && this.options.points !== 'classique') {
				const temps = Math.abs((new Date().getTime() - this.date) / 1000)
				this.temps[this.indexQuestion] = temps
				this.$emit('validation', { reponse: this.reponse, temps: this.temps, identifiant: this.identifiant, nom: this.nom })
			}
		},
		reponseEnvoyee: function (reponse) {
			if (reponse[this.indexQuestion] === 'reponse-envoyee') {
				this.notification = this.$t('reponseEnvoyee')
			}
		},
		indexQuestion: function (indexQuestion) {
			if (this.questions[indexQuestion].option === 'texte-court' && this.reponseEnvoyee[indexQuestion] === 'reponse-envoyee') {
				setTimeout(function () {
					document.querySelector('#reponses' + indexQuestion + ' textarea').value = this.reponse[indexQuestion].toString()
				}.bind(this), 0)
			}
		}
	},
	created () {
		this.description = this.donnees.description
		this.support = this.donnees.support
		this.options = this.donnees.options
		if (!this.options.hasOwnProperty('points')) {
			this.options.points = 'classique'
		}
		this.questions = this.donnees.questions
		this.reponses.forEach(function (item) {
			if (item.identifiant === this.identifiant) {
				this.reponse = item.reponse
				if (item.hasOwnProperty('temps')) {
					this.temps = item.temps
				}
			}
		}.bind(this))
		this.questions.forEach(function (item) {
			if (item.hasOwnProperty('retroaction') && item.retroaction.correcte !== '') {
				item.retroaction.correcte = linkifyHtml(item.retroaction.correcte, {
					defaultProtocol: 'https',
					target: '_blank'
				})
			}
			if (item.hasOwnProperty('retroaction') && item.retroaction.incorrecte !== '') {
				item.retroaction.incorrecte = linkifyHtml(item.retroaction.incorrecte, {
					defaultProtocol: 'https',
					target: '_blank'
				})
			}
		})
		if (this.reponse.length === 0) {
			this.questions.forEach(function () {
				this.reponse.push([])
				this.temps.push([])
			}.bind(this))
		}
	},
	mounted () {
		this.$nextTick(function () {
			if (this.questions[this.indexQuestion] && this.questions[this.indexQuestion].hasOwnProperty('option') && this.questions[this.indexQuestion].option === 'texte-court' && this.reponseEnvoyee[this.indexQuestion] === 'reponse-envoyee') {
				this.$nextTick(function () {
					document.querySelector('#reponses' + this.indexQuestion + ' textarea').value = this.reponse[this.indexQuestion].toString()
				}.bind(this))
			}
		}.bind(this))
	},
	methods: {
		definirReponseCorrecte (indexQuestion) {
			const reponseCorrecte = []
			const bonnesReponses = []
			const mauvaisesReponses = []
			if (this.questions[indexQuestion].option !== 'texte-court') {
				this.questions[indexQuestion].items.forEach(function (item) {
					if (item.reponse === true && item.texte !== '') {
						reponseCorrecte.push(item.texte)
					} else if (item.reponse === true && item.image !== '') {
						reponseCorrecte.push(item.image)
					}
				})
				this.questions[indexQuestion].items.forEach(function (item) {
					if (item.reponse === true && (this.reponse[indexQuestion].includes(item.texte) || this.reponse[indexQuestion].includes(item.image))) {
						bonnesReponses.push(item)
					} else if (item.reponse === false && (this.reponse[indexQuestion].includes(item.texte) || this.reponse[indexQuestion].includes(item.image))) {
						mauvaisesReponses.push(item)
					}
				}.bind(this))
			} else {
				const reponsesTexte = this.questions[indexQuestion].reponses.split(',')
				reponsesTexte.forEach(function (item, index) {
					reponsesTexte[index] = item.trim()
				})
				reponseCorrecte.push(...reponsesTexte)
			}
			if ((this.questions[indexQuestion].option === 'choix-unique' && bonnesReponses.length > 0) || (this.questions[indexQuestion].option === 'choix-multiples' && reponseCorrecte.every(i => this.reponse[indexQuestion].includes(i)) === true && mauvaisesReponses.length === 0) || (this.questions[indexQuestion].option === 'texte-court' && reponseCorrecte.includes(this.reponse[indexQuestion].toString().trim()) === true && mauvaisesReponses.length === 0)) {
				return true
			} else {
				return false
			}
		},
		verifierReponseTexte (indexQuestion) {
			if (this.options.reponses === true && this.reponseEnvoyee[indexQuestion] === 'reponse-envoyee') {
				const reponsesTexte = this.questions[indexQuestion].reponses.split(',')
				reponsesTexte.forEach(function (item, index) {
					reponsesTexte[index] = item.trim()
				})
				if (reponsesTexte.includes(this.reponse[indexQuestion].toString().trim()) === true) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		},
		envoyerReponse (indexQuestion) {
			if (this.reponse[indexQuestion].length > 0 && this.reponseEnvoyee[indexQuestion] !== 'reponse-envoyee' && this.options.points === 'classique') {
				this.$emit('validation', { reponse: this.reponse, identifiant: this.identifiant, nom: this.nom })
			} else if (this.reponse[indexQuestion].length > 0 && this.reponseEnvoyee[indexQuestion] !== 'reponse-envoyee' && this.options.points !== 'classique') {
				const temps = Math.abs((new Date().getTime() - this.date) / 1000)
				this.temps[indexQuestion] = temps
				this.$emit('validation', { reponse: this.reponse, temps: this.temps, identifiant: this.identifiant, nom: this.nom })
			}
		}
	}
}
</script>

<style scoped src="#root/components/css/style-multi-participer.css"></style>

<style>
#questions .retroaction span a {
	text-decoration: underline;
}
</style>
