<template>
	<div id="page">
		<div id="interaction">
			<header>
				<div id="conteneur-header">
					<a id="logo" :href="hote" />

					<div id="titre">
						<span>{{ titre }}</span>
					</div>

					<div id="parametres">
						<span role="button" tabindex="0" :title="$t('afficherParametres')" @click="afficherModaleParametres"><i class="material-icons">settings</i></span>
					</div>
				</div>
			</header>

			<transition-group name="fondu">
				<div id="conteneur" class="ascenseur" :class="{'avec-footer': statut === 'ouvert' && (donnees.options.progression === 'libre' && ((donnees.description !== '' || Object.keys(donnees.support).length > 0) || (donnees.description === '' && Object.keys(donnees.support).length === 0 && donnees.questions.length > 1))) || (donnees.options.progression === 'animateur' && indexQuestion > -1)}" v-if="statut === 'ouvert' && (type === 'Sondage' || type === 'Questionnaire')" key="conteneur-ouvert">
					<sondageParticiper :code="code" :donnees="donnees" :reponses="reponsesSession" :statut="statut" :session="session" :index-question="indexQuestion" :validation="validation" :reponse-envoyee="reponseEnvoyee" @validation="envoyerReponse" @index="modifierIndexQuestion('suivante')" @image="afficherImage" @support="afficherSupport" v-if="type === 'Sondage'" />

					<questionnaireParticiper :code="code" :donnees="donnees" :reponses="reponsesSession" :statut="statut" :session="session" :index-question="indexQuestion" :date="date" :validation="validation" :reponse-envoyee="reponseEnvoyee" @validation="envoyerReponse" @index="modifierIndexQuestion('suivante')" @image="afficherImage" @support="afficherSupport" v-else-if="type === 'Questionnaire'" />
				</div>

				<div id="conteneur" class="ascenseur" v-if="(statut === 'ouvert' || statut === 'verrouille' || statut === 'nuage-affiche') && (type === 'Remue-méninges' || type === 'Nuage-de-mots')" key="conteneur-ouvert">
					<remueMeningesParticiper :code="code" :donnees="donnees" :reponses="reponsesSession" :statut="statut" :session="session" @image="afficherImage" @media="afficherMedia" v-if="type === 'Remue-méninges'" />

					<nuageMotsParticiper :code="code" :donnees="donnees" :reponses="reponsesSession" :statut="statut" :session="session" @image="afficherImage" @media="afficherMedia" v-if="type === 'Nuage-de-mots'" />
				</div>

				<div id="conteneur" class="interaction-fermee" v-else key="conteneur-ferme">
					<div class="section">
						<div class="information" v-if="type === 'Sondage'">
							{{ $t('sondagePasOuvert') }}
						</div>
						<div class="information" v-else-if="type === 'Questionnaire' && statut !== 'attente'">
							{{ $t('questionnairePasOuvert') }}
						</div>
						<div class="information" v-else-if="type === 'Questionnaire' && statut === 'attente'">
							{{ $t('questionnaireAttenteOuverture') }}
						</div>
						<div class="information" v-else-if="type === 'Remue-méninges'">
							{{ $t('remueMeningesPasOuvert') }}
						</div>
						<div class="information" v-else-if="type === 'Nuage-de-mots'">
							{{ $t('nuageDeMotsPasOuvert') }}
						</div>
						<div class="points">
							<span class="point" />
							<span class="point" />
							<span class="point" />
						</div>
					</div>
				</div>

				<footer v-if="statut === 'ouvert' && (type === 'Sondage' || type === 'Questionnaire') && donnees.options.progression === 'animateur' && indexQuestion > -1" key="footer">
					<div class="section">
						<span class="bouton" role="button" tabindex="0" @click="valider" v-if="reponseEnvoyee[indexQuestion] !== 'reponse-envoyee'">{{ $t('valider') }}</span>
						<span class="reponse" v-else-if="reponseEnvoyee[indexQuestion] === 'reponse-envoyee'">{{ $t('reponseEnvoyee') }}</span>
					</div>
				</footer>
				<footer v-else-if="statut === 'ouvert' && (type === 'Sondage' || type === 'Questionnaire') && donnees.options.progression === 'libre' && ((donnees.description !== '' || Object.keys(donnees.support).length > 0) || (donnees.description === '' && Object.keys(donnees.support).length === 0 && donnees.questions.length > 1))" key="footer">
					<div class="section boutons">
						<span class="bouton icone" role="button" tabindex="0" :title="$t('questionPrecedente')" :class="{'visible': (donnees.description === '' && Object.keys(donnees.support).length === 0 && indexQuestion > 0) || ((donnees.description !== '' || Object.keys(donnees.support).length > 0) && indexQuestion > -1 )}" @click="modifierIndexQuestion('precedente')"><i class="material-icons">arrow_back</i></span>

						<span class="bouton icone visible" role="button" tabindex="0" :title="$t('monScore')" @click="modale = 'score'" v-if="type === 'Questionnaire'"><i class="material-icons">emoji_events</i></span>

						<span class="bouton icone" role="button" tabindex="0" :title="$t('questionSuivante')" :class="{'visible': indexQuestion < donnees.questions.length - 1}" @click="modifierIndexQuestion('suivante')"><i class="material-icons">arrow_forward</i></span>
					</div>
				</footer>
			</transition-group>
		</div>

		<div class="conteneur-modale" v-if="modale === 'parametres'">
			<div id="modale-parametres" class="modale">
				<header>
					<span class="titre">{{ $t('parametres') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModale"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label>{{ $t('langue') }}</label>
						<div class="langue">
							<span role="button" tabindex="0" :class="{'selectionne': langue === 'fr'}" @click="modifierLangue('fr')">FR</span>
							<span role="button" tabindex="0" :class="{'selectionne': langue === 'es'}" @click="modifierLangue('es')">ES</span>
							<span role="button" tabindex="0" :class="{'selectionne': langue === 'it'}" @click="modifierLangue('it')">IT</span>
							<span role="button" tabindex="0" :class="{'selectionne': langue === 'en'}" @click="modifierLangue('en')">EN</span>
						</div>
						<label>{{ $t('nomOuPseudo') }}</label>
						<input type="text" :value="nom" :disabled="statut !== '' && statut !== 'attente'">
						<div class="actions" v-if="statut === '' || statut === 'attente'">
							<span class="bouton" role="button" tabindex="0" @click="modifierNom">{{ $t('enregistrer') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'nom'">
			<div id="modale-nom" class="modale">
				<div class="conteneur">
					<div class="contenu">
						<label>{{ $t('nomOuPseudo') }}</label>
						<input type="text" :value="nom">
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="modifierNom">{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'score'">
			<div id="modale-score" class="modale">
				<header>
					<span class="titre">{{ $t('monScore') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModale"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<div class="etoiles" v-if="etoilesScore">
							<span v-for="etoile in (parseInt(10 * (scoreTotal / pointsTotal)))" :key="etoile"><i class="material-icons">star_rate</i></span>
						</div>
						<span class="score">{{ scoreTotal }}</span>
						<span class="sur">{{ $t('sur') }}</span>
						<span class="total">{{ pointsTotal }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'classement'">
			<div id="modale-classement" class="modale">
				<header>
					<span class="titre">{{ $t('classement') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModale"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<ul class="classement">
							<li v-for="(utilisateur, index) in classement" :key="'utilisateur_' + index">
								<div class="utilisateur">
									<span class="index">{{ index + 1 }}</span>
									<span class="nom">{{ utilisateur.nom }}</span>
								</div>
								<div class="score">{{ utilisateur.score }}</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'image'">
			<div id="modale-image" class="modale">
				<div class="conteneur">
					<div class="contenu">
						<img :src="image" :alt="$t('image')">
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerModaleImage">{{ $t('fermer') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'support'">
			<div id="modale-media" class="modale">
				<div class="conteneur">
					<div class="contenu">
						<img v-if="donnees.support.type === 'image'" :src="'/fichiers/' + code + '/' + donnees.support.fichier" :alt="$t('image')">
						<audio v-else-if="donnees.support.type === 'audio'" controls :src="'/fichiers/' + code + '/' + donnees.support.fichier" />
						<div class="video" v-else-if="donnees.support.type === 'video'">
							<iframe :src="donnees.support.lien" allowfullscreen />
						</div>
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerModale">{{ $t('fermer') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" v-else-if="modale === 'media'">
			<div id="modale-media" class="modale">
				<div class="conteneur">
					<div class="contenu">
						<img v-if="media.type === 'image'" :src="media.fichier" :alt="$t('image')">
						<audio v-else-if="media.type === 'audio'" controls :src="media.fichier" />
						<div class="video" v-else-if="media.type === 'video'">
							<iframe :src="media.lien" allowfullscreen />
						</div>
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerModaleMedia">{{ $t('fermer') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<chargement :chargement="chargement" v-if="chargement" />
	</div>
</template>

<script>
import axios from 'axios'
import chargement from '@/components/chargement.vue'
import sondageParticiper from '@/components/sondageParticiper.vue'
import questionnaireParticiper from '@/components/questionnaireParticiper.vue'
import remueMeningesParticiper from '@/components/remueMeningesParticiper.vue'
import nuageMotsParticiper from '@/components/nuageMotsParticiper.vue'

export default {
	name: 'Participer',
	components: {
		chargement,
		sondageParticiper,
		questionnaireParticiper,
		remueMeningesParticiper,
		nuageMotsParticiper
	},
	async asyncData (context) {
		const code = context.route.params.code
		const reponse = await axios.post(context.store.state.hote + '/api/recuperer-donnees-interaction', {
			code: code
		}, {
			headers: { 'Content-Type': 'application/json' }
		}).catch(function () {
			return {
				redirection: '/',
				code: code,
				type: '',
				titre: '',
				reponses: {},
				statut: ''
			}
		})
		if (!reponse || !reponse.hasOwnProperty('data')) {
			return {
				redirection: '/',
				code: code,
				type: '',
				titre: '',
				reponses: {},
				statut: ''
			}
		} else if (reponse.data && reponse.data === 'erreur') {
			return {
				redirection: '/',
				code: code,
				type: '',
				titre: '',
				reponses: {},
				statut: ''
			}
		} else {
			return {
				code: code,
				type: reponse.data.type,
				titre: reponse.data.titre,
				donnees: reponse.data.donnees,
				reponses: reponse.data.reponses,
				statut: reponse.data.statut,
				session: reponse.data.session
			}
		}
	},
	data () {
		return {
			chargement: false,
			mobile: false,
			modale: '',
			validation: '',
			reponsesSession: [],
			reponseEnvoyee: [],
			indexQuestion: -1,
			date: 0,
			classement: [],
			etoilesScore: false,
			pageChargee: false,
			image: '',
			media: {}
		}
	},
	head () {
		return {
			title: this.titre + ' - Digistorm by La Digitale'
		}
	},
	computed: {
		hote () {
			return this.$store.state.hote
		},
		identifiant () {
			return this.$store.state.identifiant
		},
		nom () {
			return this.$store.state.nom
		},
		langue () {
			return this.$store.state.langue
		},
		langues () {
			return this.$store.state.langues
		},
		scoreTotal () {
			let score = 0
			let scoreTemps = []
			let temps = []
			let reponses = []
			this.reponsesSession.forEach(function (item) {
				if (item.identifiant === this.identifiant) {
					reponses = item.reponse
					if (item.hasOwnProperty('score') && this.donnees.options.points !== 'classique') {
						scoreTemps = item.score
					}
					if (item.hasOwnProperty('temps') && this.donnees.options.points !== 'classique') {
						temps = item.temps
					}
				}
			}.bind(this))
			if (scoreTemps.length > 0) {
				scoreTemps.forEach(function (points) {
					score = score + points
				})
			} else {
				this.donnees.questions.forEach(function (question, indexQuestion) {
					const reponseCorrecte = []
					question.items.forEach(function (item) {
						if (item.reponse === true && item.texte !== '') {
							reponseCorrecte.push(item.texte)
						} else if (item.reponse === true && item.image !== '') {
							reponseCorrecte.push(item.image)
						}
					})
					const bonnesReponses = []
					const mauvaisesReponses = []
					question.items.forEach(function (item) {
						if (item.reponse === true && (reponses[indexQuestion].includes(item.texte) || reponses[indexQuestion].includes(item.image))) {
							bonnesReponses.push(item)
						} else if (item.reponse === false && (reponses[indexQuestion].includes(item.texte) || reponses[indexQuestion].includes(item.image))) {
							mauvaisesReponses.push(item)
						}
					})
					let multiplicateurSecondes = 10
					if (this.donnees.options.hasOwnProperty('multiplicateur') && this.donnees.options.multiplicateur > 0) {
						multiplicateurSecondes = this.donnees.options.multiplicateur
					}
					if (((question.option === 'choix-unique' && bonnesReponses.length > 0) || (question.option === 'choix-multiples' && reponseCorrecte.every(i => reponses[indexQuestion].includes(i)) === true && mauvaisesReponses.length === 0)) && this.donnees.options.points === 'classique' && question.hasOwnProperty('points')) {
						score = score + question.points
					} else if (((question.option === 'choix-unique' && bonnesReponses.length > 0) || (question.option === 'choix-multiples' && reponseCorrecte.every(i => reponses[indexQuestion].includes(i)) === true && mauvaisesReponses.length === 0)) && this.donnees.options.points === 'classique' && !question.hasOwnProperty('points')) {
						score = score + 1000
					} else if (((question.option === 'choix-unique' && bonnesReponses.length > 0) || (question.option === 'choix-multiples' && reponseCorrecte.every(i => reponses[indexQuestion].includes(i)) === true && mauvaisesReponses.length === 0)) && this.donnees.options.points !== 'classique' && question.hasOwnProperty('points')) {
						score = score + Math.round(question.points - (temps[indexQuestion] * multiplicateurSecondes))
					} else if (((question.option === 'choix-unique' && bonnesReponses.length > 0) || (question.option === 'choix-multiples' && reponseCorrecte.every(i => reponses[indexQuestion].includes(i)) === true && mauvaisesReponses.length === 0)) && this.donnees.options.points !== 'classique' && !question.hasOwnProperty('points')) {
						score = score + Math.round(1000 - (temps[indexQuestion] * multiplicateurSecondes))
					} else if ((bonnesReponses.length - mauvaisesReponses.length) > 0 && this.donnees.options.points === 'classique' && question.hasOwnProperty('points')) {
						score = score + ((question.points / reponseCorrecte.length) * (bonnesReponses.length - mauvaisesReponses.length))
					} else if ((bonnesReponses.length - mauvaisesReponses.length) > 0 && this.donnees.options.points === 'classique' && !question.hasOwnProperty('points')) {
						score = score + ((1000 / reponseCorrecte.length) * (bonnesReponses.length - mauvaisesReponses.length))
					} else if ((bonnesReponses.length - mauvaisesReponses.length) > 0 && this.donnees.options.points !== 'classique' && question.hasOwnProperty('points')) {
						score = score + ((Math.round(question.points - (temps[indexQuestion] * multiplicateurSecondes)) / reponseCorrecte.length) * (bonnesReponses.length - mauvaisesReponses.length))
					} else if ((bonnesReponses.length - mauvaisesReponses.length) > 0 && this.donnees.options.points !== 'classique' && !question.hasOwnProperty('points')) {
						score = score + ((Math.round(1000 - (temps[indexQuestion] * multiplicateurSecondes)) / reponseCorrecte.length) * (bonnesReponses.length - mauvaisesReponses.length))
					} else {
						score = score + 0
					}
				}.bind(this))
			}
			return score
		},
		pointsTotal () {
			let points = 0
			this.donnees.questions.forEach(function (question) {
				if (question.hasOwnProperty('points')) {
					points = points + question.points
				} else {
					points = points + 1000
				}
			})
			return points
		}
	},
	watch: {
		reponsesSession: function (reponses) {
			if (this.type === 'Questionnaire') {
				let nombreReponses = 0
				const nombreQuestions = this.donnees.questions.length
				reponses.forEach(function (item) {
					if (item.identifiant === this.identifiant) {
						item.reponse.forEach(function (reponse) {
							if (reponse.length > 0) {
								nombreReponses++
							}
						})
					}
				}.bind(this))
				if (nombreReponses === nombreQuestions && this.donnees.options.classement === false) {
					this.etoilesScore = true
					this.modale = 'score'
				} else {
					this.etoilesScore = false
				}
			}
		},
		classement: function (classement) {
			if (classement.length === 0 && this.modale === 'classement') {
				this.modale = ''
			} else if (classement.length > 0) {
				this.modale = 'classement'
			}
		}
	},
	watchQuery: ['page'],
	created () {
		if (this.redirection) {
			this.$router.replace(this.redirection)
			return false
		}
		this.$nuxt.$loading.start()
		this.ecouterSocket()
		this.$socket.emit('connexion', { code: this.code, identifiant: this.identifiant, nom: this.nom })
		if (this.reponses[this.session]) {
			this.reponsesSession = this.reponses[this.session]
		}
		if ((this.type === 'Sondage' || this.type === 'Questionnaire') && Object.keys(this.donnees).length > 0) {
			this.indexQuestion = parseInt(this.donnees.indexQuestion)
			const reponseEnvoyee = []
			this.donnees.questions.forEach(function () {
				reponseEnvoyee.push('')
			})
			this.reponsesSession.forEach(function (item) {
				if (item.identifiant === this.identifiant) {
					item.reponse.forEach(function (reponse, index) {
						if (reponse.length > 0) {
							reponseEnvoyee.splice(index, 1, 'reponse-envoyee')
						}
					})
				}
			}.bind(this))
			this.reponseEnvoyee = reponseEnvoyee
			if (this.donnees.options.nom === 'obligatoire' && (this.statut === 'attente' || (this.statut === 'ouvert' && this.nom === ''))) {
				this.afficherModaleNom()
			}
		}
		if (this.type === 'Questionnaire' && !this.donnees.options.hasOwnProperty('retroaction')) {
			this.donnees.options.retroaction = false
		}
		const langue = this.$route.query.lang
		if (this.langues.includes(langue) === true) {
			this.$i18n.setLocale(langue)
			this.$store.dispatch('modifierLangue', langue)
			this.$socket.emit('modifierlangue', langue)
		} else {
			this.$i18n.setLocale(this.langue)
		}
	},
	mounted () {
		if (this.type === 'Questionnaire' && this.statut === 'ouvert' && this.donnees.options.progression === 'animateur' && this.donnees.options.hasOwnProperty('points') && this.donnees.options.points === 'vitesse' && localStorage.getItem('date')) {
			this.date = parseInt(localStorage.getItem('date'))
		}
		setTimeout(function () {
			this.$nuxt.$loading.finish()
			document.getElementsByTagName('html')[0].setAttribute('lang', this.langue)
			this.$nextTick(function () {
				window.MathJax.typeset()
			})
		}.bind(this), 100)

		window.addEventListener('beforeunload', this.quitterPage, false)

		this.mobile = (window.navigator.maxTouchPoints || 'ontouchstart' in document)
		if (this.mobile) {
			window.addEventListener('pageshow', function () {
				setTimeout(function () {
					if (this.pageChargee && !this.chargement) {
						this.chargement = true
						this.$socket.emit('donnees', { code: this.code, identifiant: this.identifiant, nom: this.nom })
					}
					if (!this.pageChargee) {
						this.pageChargee = true
					}
				}.bind(this), 100)
			}.bind(this))

			document.addEventListener('visibilitychange', function () {
				setTimeout(function () {
					if (this.pageChargee && !this.chargement && document.visibilityState === 'visible') {
						this.chargement = true
						this.$socket.emit('donnees', { code: this.code, identifiant: this.identifiant, nom: this.nom })
					}
				}.bind(this), 100)
			}.bind(this))
		}
	},
	beforeDestroy () {
		window.removeEventListener('beforeunload', this.quitterPage, false)
	},
	methods: {
		afficherModaleParametres () {
			this.modale = 'parametres'
			this.$nextTick(function () {
				document.querySelector('#modale-parametres input').focus()
			})
		},
		fermerModale () {
			this.modale = ''
		},
		afficherImage (event, image) {
			event.preventDefault()
			event.stopPropagation()
			this.image = image
			this.modale = 'image'
		},
		fermerModaleImage () {
			this.modale = ''
			this.image = ''
		},
		afficherSupport () {
			this.modale = 'support'
		},
		afficherMedia (event, media, type) {
			event.preventDefault()
			event.stopPropagation()
			if (type === 'video') {
				this.media = { lien: media, type: type }
			} else {
				this.media = { fichier: media, type: type }
			}
			this.modale = 'media'
		},
		fermerModaleMedia () {
			this.modale = ''
			this.media = {}
		},
		afficherModaleNom () {
			this.modale = 'nom'
			this.$nextTick(function () {
				document.querySelector('#modale-nom input').focus()
			})
		},
		modifierLangue (langue) {
			if (this.langue !== langue) {
				this.chargement = true
				axios.post(this.hote + '/api/modifier-langue', {
					identifiant: this.identifiant,
					langue: langue
				}).then(function () {
					this.$i18n.setLocale(langue)
					document.getElementsByTagName('html')[0].setAttribute('lang', langue)
					this.$store.dispatch('modifierLangue', langue)
					this.$store.dispatch('modifierNotification', this.$t('langueModifiee'))
					this.chargement = false
				}.bind(this)).catch(function () {
					this.chargement = false
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		modifierNom () {
			let nom = ''
			if (this.modale === 'nom') {
				nom = document.querySelector('#modale-nom input').value
			} else if (this.modale === 'parametres') {
				nom = document.querySelector('#modale-parametres input').value
			}
			if ((this.type === 'Questionnaire' || this.type === 'Sondage') && this.donnees.options.nom === 'obligatoire' && nom === '') {
				return false
			}
			if (this.modale !== 'nom' && this.nom !== '' && this.nom === nom) {
				this.modale = ''
				return false
			}
			if (this.modale === 'nom') {
				this.modale = ''
			}
			this.chargement = true
			axios.post(this.hote + '/api/modifier-nom', {
				nom: nom
			}).then(function (reponse) {
				const donnees = reponse.data
				this.chargement = false
				if (donnees === 'nom_modifie') {
					this.$store.dispatch('modifierNom', nom)
					this.$store.dispatch('modifierNotification', this.$t('nomModifie'))
					this.$socket.emit('modifiernom', { code: this.code, identifiant: this.identifiant, nom: nom })
					this.$socket.emit('connexion', { code: this.code, identifiant: this.identifiant, nom: nom })
				}
			}.bind(this)).catch(function () {
				this.chargement = false
				this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
			}.bind(this))
		},
		modifierIndexQuestion (direction) {
			if (direction === 'precedente' && ((this.donnees.description === '' && Object.keys(this.donnees.support).length === 0 && this.indexQuestion > 0) || ((this.donnees.description !== '' || Object.keys(this.donnees.support).length > 0) && this.indexQuestion > -1))) {
				this.indexQuestion--
			} else if (direction === 'suivante' && this.indexQuestion < this.donnees.questions.length - 1) {
				this.indexQuestion++
			}
		},
		valider () {
			this.validation = 'validation'
		},
		envoyerReponse (donnees) {
			if (donnees.reponse.length > 0) {
				this.chargement = true
				this.$socket.emit('reponse', { code: this.code, session: this.session, donnees: donnees })
			} else {
				this.validation = ''
			}
		},
		quitterPage () {
			this.$socket.emit('deconnexion', this.code)
		},
		ecouterSocket () {
			this.$socket.on('donnees', function (interaction) {
				this.chargement = false
				this.modale = ''
				this.titre = interaction.titre
				this.statut = interaction.statut
				this.donnees = interaction.donnees
				this.reponses = interaction.reponses
				this.session = interaction.session
				if (this.reponses[this.session]) {
					this.reponsesSession = this.reponses[this.session]
				}
				if ((this.type === 'Sondage' || this.type === 'Questionnaire') && Object.keys(this.donnees).length > 0) {
					this.indexQuestion = parseInt(this.donnees.indexQuestion)
					const reponseEnvoyee = []
					this.donnees.questions.forEach(function () {
						reponseEnvoyee.push('')
					})
					this.reponsesSession.forEach(function (item) {
						if (item.identifiant === this.identifiant) {
							item.reponse.forEach(function (reponse, index) {
								if (reponse.length > 0) {
									reponseEnvoyee.splice(index, 1, 'reponse-envoyee')
								}
							})
						}
					}.bind(this))
					this.reponseEnvoyee = reponseEnvoyee
					if (this.type === 'Questionnaire' && this.donnees.options.progression === 'animateur' && this.donnees.options.hasOwnProperty('points') && this.donnees.options.points === 'vitesse' && localStorage.getItem('date')) {
						this.date = parseInt(localStorage.getItem('date'))
					} else if (this.type === 'Questionnaire' && this.donnees.options.progression === 'animateur' && this.donnees.options.hasOwnProperty('points') && this.donnees.options.points === 'vitesse' && !localStorage.getItem('date')) {
						this.date = new Date().getTime()
						localStorage.setItem('date', new Date().getTime())
					}
					if (this.donnees.options.nom === 'obligatoire' && (this.statut === 'attente' || (this.statut === 'ouvert' && this.nom === ''))) {
						this.afficherModaleNom()
					}
				}
				if (this.type === 'Questionnaire' && !this.donnees.options.hasOwnProperty('retroaction')) {
					this.donnees.options.retroaction = false
				}
				this.$nextTick(function () {
					window.MathJax.typeset()
				})
			}.bind(this))

			this.$socket.on('interactionouverte', function (interaction) {
				this.statut = 'ouvert'
				this.titre = interaction.titre
				this.donnees = interaction.donnees
				this.session = interaction.session
				this.validation = ''
				this.reponsesSession = []
				if (this.type === 'Sondage' || this.type === 'Questionnaire') {
					this.indexQuestion = this.donnees.copieIndexQuestion
					const reponseEnvoyee = []
					this.donnees.questions.forEach(function () {
						reponseEnvoyee.push('')
					})
					this.reponseEnvoyee = reponseEnvoyee
					if (this.type === 'Questionnaire' && this.donnees.options.progression === 'animateur' && this.donnees.options.hasOwnProperty('points') && this.donnees.options.points === 'vitesse') {
						this.date = interaction.date
						localStorage.setItem('date', interaction.date)
					}
					if (this.donnees.options.nom === 'facultatif' && this.modale === 'nom') {
						this.modale = ''
					} else if (this.donnees.options.nom === 'obligatoire' && this.donnees.options.progression === 'libre') {
						this.afficherModaleNom()
					}
				}
				this.$nextTick(function () {
					window.MathJax.typeset()
				})
			}.bind(this))

			this.$socket.on('interactionenattente', function (donnees) {
				this.statut = 'attente'
				this.donnees = donnees
				if (this.donnees.options.nom === 'obligatoire') {
					this.afficherModaleNom()
				} else {
					this.modale = ''
				}
			}.bind(this))

			this.$socket.on('interactionverrouillee', function () {
				this.statut = 'verrouille'
			}.bind(this))

			this.$socket.on('interactiondeverrouillee', function () {
				this.statut = 'ouvert'
				this.$nextTick(function () {
					window.MathJax.typeset()
				})
			}.bind(this))

			this.$socket.on('interactionfermee', function () {
				if (this.modale === 'nom' || this.modale === 'parametres' || this.modale === 'score') {
					this.modale = ''
				}
				this.statut = 'termine'
			}.bind(this))

			this.$socket.on('questionsuivante', function (donnees) {
				this.date = donnees.date
				localStorage.setItem('date', donnees.date)
				this.indexQuestion = donnees.index
				this.classement = []
				this.$nextTick(function () {
					window.MathJax.typeset()
				})
			}.bind(this))

			this.$socket.on('classement', function (donnees) {
				this.classement = donnees
			}.bind(this))

			this.$socket.on('reponseenvoyee', function (res) {
				if (this.type === 'Sondage' || this.type === 'Questionnaire') {
					this.chargement = false
					this.validation = ''
					res.donnees.reponse.forEach(function (reponse, index) {
						if (reponse.length > 0) {
							this.reponseEnvoyee.splice(index, 1, 'reponse-envoyee')
						}
					}.bind(this))
				}
			}.bind(this))

			this.$socket.on('reponses', function (donnees) {
				if (donnees.code === this.code && donnees.session === this.session) {
					this.reponsesSession = donnees.reponses
				}
			}.bind(this))

			this.$socket.on('modifiercouleurmot', function (donnees) {
				if (donnees.code === this.code && donnees.session === this.session) {
					this.reponsesSession.forEach(function (item, index) {
						if (item.reponse.texte === donnees.mot) {
							this.reponsesSession[index].reponse.couleur = donnees.couleur
						}
					}.bind(this))
				}
			}.bind(this))

			this.$socket.on('erreur', function () {
				this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
			}.bind(this))

			this.$socket.on('erreurcode', function () {
				this.$store.dispatch('modifierMessage', this.$t('codeNonValide'))
			}.bind(this))
		}
	}
}
</script>

<style scoped>
#titre {
	width: calc(100% - 88px)!important;
}

#titre span {
	overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#parametres {
	font-size: 24px;
	line-height: 40px;
	margin-left: 20px;
	cursor: pointer;
}

#conteneur {
	height: calc(100% - 40px)!important;
	margin-bottom: 0!important;
}

#conteneur.avec-footer {
	height: calc(100% - 100px)!important;
	margin-bottom: 60px!important;
}

#conteneur.interaction-fermee {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	align-items: center;
}

#conteneur.interaction-fermee .information {
	display: block;
	width: 100%;
	font-size: 25px;
	font-weight: 700;
	line-height: 1.4;
	margin-bottom: 40px;
	text-align: center;
}

#conteneur.interaction-fermee .points {
	display: flex;
	justify-content: center;
	width: 100%;
}

#conteneur.interaction-fermee .point {
	display: inline-block;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 15px;
	background: #00ced1;
	animation: vague 1.5s linear infinite;
}

#conteneur.interaction-fermee .point:nth-child(2) {
	animation-delay: -1.1s;
}

#conteneur.interaction-fermee .point:nth-child(3) {
	animation-delay: -0.7s;
}

#interaction footer .section {
	justify-content: center;
}

#interaction footer .section.boutons {
	justify-content: space-between;
}

#interaction footer .bouton:not(.icone) {
    font-size: 18px;
	padding: 0 50px;
	background: #009688;
}

#interaction footer .bouton:not(.icone):hover {
	background: #00a695;
}

#interaction footer .bouton.icone {
	visibility: hidden;
    font-size: 48px;
	border: none;
    border-radius: 0;
}

#interaction footer .bouton.icone.visible {
	visibility: visible;
}

#interaction footer .reponse {
    font-size: 2rem;
    font-weight: 700;
    color: #009688;
	line-height: 1;
}

#modale-parametres input {
	margin-bottom: 10px;
}

#modale-parametres span.bouton {
	width: 100%;
	text-align: center;
}

#modale-score {
	max-width: 520px;
}

#modale-score .etoiles {
	display: flex;
	justify-content: center;
	width: 100%;
}

#modale-score .etoiles span {
	font-size: 48px;
	color: #ffe900;
}

#modale-score span.total,
#modale-score span.sur,
#modale-score span.score {
    display: block;
    width: 100%;
    text-align: center;
}

#modale-score span.score {
	font-size: 5rem;
    font-weight: 700;
}

#modale-score span.total {
	font-size: 3rem;
}

#modale-media img,
#modale-image img {
	max-height: calc(90vh - 100px);
}

@keyframes vague {
	0%, 60%, 100% {
		transform: initial;
	}
	30% {
		transform: translateY(-30px);
	}
}

@media screen and (max-width: 359px) {
	#modale-score .etoiles span {
		font-size: 24px;
	}
}

@media screen and (min-width: 360px) and (max-width: 599px) {
	#modale-score .etoiles span {
		font-size: 30px;
	}
}

@media screen and (orientation: landscape) and (max-height: 399px) {
	#modale-parametres {
		height: 90%;
	}
}
</style>
