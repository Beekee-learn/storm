<template>
	<div id="sondage">
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
				<img v-if="support.type === 'image'" :src="'/fichiers/' + code + '/' + support.fichier" :alt="support.alt" @click="afficherImage('/fichiers/' + code + '/' + support.fichier)">
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
					<div :id="'reponses' + indexQ" class="conteneur-textarea" v-else>
						<TextareaAutosize :rows="2" :min-height="46" :max-height="124" :placeholder="$t('votreReponse')" @input="definirReponse($event, indexQ)" :disabled="reponseEnvoyee[indexQ] === 'reponse-envoyee'" v-if="indexQuestion === indexQ" />
					</div>

					<div class="actions" v-if="options.progression === 'libre'">
						<span class="bouton bouton-reponse" :class="{'desactive': reponse[indexQ].length === 0}" role="button" tabindex="0" @click="envoyerReponse(indexQ)" v-if="reponseEnvoyee[indexQ] !== 'reponse-envoyee'">{{ $t('envoyer') }}</span>
						<span class="reponse" v-else>{{ $t('reponseEnvoyee') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="modifierIndexQuestion" v-if="reponseEnvoyee[indexQ] === 'reponse-envoyee' && reponse[indexQ + 1] && reponse[indexQ + 1].length === 0">{{ $t('questionSuivante') }}</span>
					</div>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script>
import TextareaAutosize from '#root/components/textareaAutosize.vue'
import methodes from '#root/components/js/methodes-multi-participer'

export default {
	name: 'SondageParticiper',
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
		validation: String,
		reponseEnvoyee: Array
	},
	data () {
		return {
			description: '',
			support: {},
			options: {},
			questions: [],
			reponse: []
		}
	},
	watch: {
		validation: function (valeur) {
			if (this.options.progression === 'animateur') {
				if (valeur === 'validation') {
					this.$emit('validation', { reponse: this.reponse, identifiant: this.identifiant, nom: this.nom })
				}
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
		this.questions = this.donnees.questions
		this.reponses.forEach(function (item) {
			if (item.identifiant === this.identifiant) {
				this.reponse = item.reponse
			}
		}.bind(this))
		if (this.reponse.length === 0) {
			this.questions.forEach(function () {
				this.reponse.push([])
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
		envoyerReponse (indexQuestion) {
			if (this.reponse[indexQuestion].length > 0 && this.reponseEnvoyee[indexQuestion] !== 'reponse-envoyee') {
				this.$emit('validation', { reponse: this.reponse, identifiant: this.identifiant, nom: this.nom })
			}
		}
	}
}
</script>

<style scoped src="#root/components/css/style-multi-participer.css"></style>
