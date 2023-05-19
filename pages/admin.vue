<template>
	<main id="page" v-if="acces">
		<div id="accueil">
			<div id="langues">
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'fr'}" @click="modifierLangue('fr')">FR</span>
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'it'}" @click="modifierLangue('it')">IT</span>
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'en'}" @click="modifierLangue('en')">EN</span>
			</div>
			<div id="conteneur">
				<h1>
					<span>{{ $t('modifierMotDePasseUtilisateur') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('identifiant') }}</label>
					<input type="text" :value="identifiant" @input="identifiant = $event.target.value">
				</div>
				<div class="conteneur">
					<label>{{ $t('email') }}</label>
					<input type="text" :value="email" @input="email = $event.target.value">
				</div>
				<div class="conteneur">
					<label>{{ $t('motDePasse') }}</label>
					<input type="text" maxlength="48" :value="motdepasse" @input="motdepasse = $event.target.value">
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="modifierMotDePasse">{{ $t('valider') }}</span>
				</div>
				<h1>
					<span>{{ $t('recupererDonneesInteraction') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('codeInteraction') }}</label>
					<input type="number" :value="code" @input="code = $event.target.value">
				</div>
				<div class="conteneur" v-if="donneesInteraction !== ''">
					<span class="donnees">{{ donneesInteraction }}</span>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="recupererDonneesInteraction">{{ $t('valider') }}</span>
				</div>
				<h1>
					<span>{{ $t('modifierDonneesInteraction') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('codeInteraction') }}</label>
					<input type="number" :value="codeM" @input="codeM = $event.target.value">
				</div>
				<div class="conteneur">
					<label>{{ $t('champ') }}</label>
					<select @change="champ = $event.target.value">
						<option value="" :selected="champ === ''">-</option>
						<option value="motdepasse" :selected="champ === 'motdepasse'">{{ $t('motDePasse') }}</option>
						<option value="titre" :selected="champ === 'titre'">{{ $t('titre') }}</option>
					</select>
				</div>
				<div class="conteneur">
					<label>{{ $t('valeur') }}</label>
					<input type="text" :value="valeur" :maxlength="4" @input="valeur = $event.target.value" v-if="champ === 'motdepasse'">
					<input type="text" :value="valeur" @input="valeur = $event.target.value" v-else>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="modifierDonneesInteraction">{{ $t('valider') }}</span>
				</div>
				<h1>
					<span>{{ $t('exporterInteraction') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('codeInteraction') }}</label>
					<input type="number" :value="codeE" @input="codeE = $event.target.value">
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="exporterInteraction">{{ $t('valider') }}</span>
				</div>
				<h1>
					<span>{{ $t('supprimerInteraction') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('codeInteraction') }}</label>
					<input type="number" :value="codeS" @input="codeS = $event.target.value">
				</div>
				<div class="conteneur">
					<div class="conteneur-interrupteur">
						<span>{{ $t('supprimerFichiersServeur') }}</span>
						<label class="bouton-interrupteur">
							<input type="checkbox" :checked="suppressionFichiers" @change="modifierSuppressionFichiers">
							<span class="barre" />
						</label>
					</div>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="modale = 'supprimer-interaction'">{{ $t('valider') }}</span>
				</div>
				<h1>
					<span>{{ $t('supprimerCompte') }}</span>
				</h1>
				<div class="conteneur">
					<label>{{ $t('identifiant') }}</label>
					<input type="text" :value="identifiantS" @input="identifiantS = $event.target.value">
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="modale = 'supprimer-compte'">{{ $t('valider') }}</span>
				</div>
			</div>
		</div>

		<div class="conteneur-modale alerte" v-if="modale !== ''">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<div class="message" v-html="$t('confirmationSupprimerInteraction')" v-if="modale === 'supprimer-interaction'" />
						<div class="message" v-html="$t('confirmationSupprimerCompteAdmin')" v-else-if="modale === 'supprimer-compte'" />
						<div class="actions">
							<span role="button" tabindex="0" class="bouton" @click="modale = ''">{{ $t('non') }}</span>
							<span role="button" tabindex="0" class="bouton" @click="supprimerInteraction" v-if="modale === 'supprimer-interaction'">{{ $t('oui') }}</span>
							<span role="button" tabindex="0" class="bouton" @click="supprimerCompte" v-else-if="modale === 'supprimer-compte'">{{ $t('oui') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<chargement :chargement="chargement" v-if="chargement" />
	</main>
</template>

<script>
import axios from 'axios'
import saveAs from 'file-saver'
import chargement from '../components/chargement.vue'

export default {
	name: 'Admin',
	components: {
		chargement
	},
	data () {
		return {
			chargement: false,
			acces: false,
			admin: '',
			modale: '',
			identifiant: '',
			email: '',
			motdepasse: '',
			code: '',
			codeS: '',
			codeM: '',
			codeE: '',
			donneesInteraction: '',
			identifiantS: '',
			champ: '',
			valeur: '',
			suppressionFichiers: true
		}
	},
	head () {
		return {
			title: 'Admin - Digistorm by La Digitale'
		}
	},
	computed: {
		hote () {
			return this.$store.state.hote
		},
		langue () {
			return this.$store.state.langue
		}
	},
	created () {
		this.$i18n.setLocale(this.langue)
	},
	mounted () {
		const motdepasse = prompt(this.$t('motDePasse'), '')
		if (motdepasse === process.env.adminPassword) {
			this.acces = true
			this.admin = motdepasse
		}
	},
	methods: {
		modifierLangue (langue) {
			if (this.langue !== langue) {
				axios.post(this.hote + '/api/modifier-langue', {
					identifiant: this.identifiant,
					langue: langue
				}).then(function () {
					this.$i18n.setLocale(langue)
					document.getElementsByTagName('html')[0].setAttribute('lang', langue)
					this.$store.dispatch('modifierLangue', langue)
					this.$store.dispatch('modifierNotification', this.$t('langueModifiee'))
				}.bind(this)).catch(function () {
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		modifierMotDePasse () {
			if (this.motdepasse !== '' && (this.identifiant !== '' || this.email !== '')) {
				this.chargement = true
				axios.post(this.hote + '/api/modifier-mot-de-passe-admin', {
					admin: this.admin,
					identifiant: this.identifiant,
					email: this.email,
					motdepasse: this.motdepasse
				}).then(function (reponse) {
					this.chargement = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurActionServeur'))
					} else if (donnees === 'identifiant_non_valide') {
						this.$store.dispatch('modifierMessage', this.$t('identifiantNonValide'))
					} else if (donnees === 'email_non_valide') {
						this.$store.dispatch('modifierMessage', this.$t('erreurEmail'))
					} else {
						this.$store.dispatch('modifierNotification', this.$t('motDePasseModifie'))
						if (donnees !== 'motdepasse_modifie') {
							this.$store.dispatch('modifierMessage', this.$t('identifiant') + ' : ' + donnees)
						}
					}
					this.identifiant = ''
					this.motdepasse = ''
					this.email = ''
				}.bind(this)).catch(function () {
					this.chargement = false
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		recupererDonneesInteraction () {
			if (this.code !== '') {
				this.chargement = true
				axios.post(this.hote + '/api/recuperer-donnees-interaction-admin', {
					code: this.code
				}).then(function (reponse) {
					this.chargement = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurActionServeur'))
					} else if (donnees === 'interaction_inexistante') {
						this.$store.dispatch('modifierMessage', this.$t('interactionInexistante'))
					} else {
						this.donneesInteraction = donnees
					}
					this.code = ''
				}.bind(this)).catch(function () {
					this.chargement = false
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		modifierDonneesInteraction () {
			if (this.codeM !== '' && this.champ !== '' && this.valeur !== '') {
				this.chargement = true
				axios.post(this.hote + '/api/modifier-donnees-interaction-admin', {
					code: this.codeM,
					champ: this.champ,
					valeur: this.valeur
				}).then(function (reponse) {
					this.chargement = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurActionServeur'))
					} else if (donnees === 'interaction_inexistante') {
						this.$store.dispatch('modifierMessage', this.$t('interactionInexistante'))
					} else {
						this.$store.dispatch('modifierNotification', this.$t('donneesModifiees'))
					}
					this.codeM = ''
					this.champ = ''
					this.valeur = ''
				}.bind(this)).catch(function () {
					this.chargement = false
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		modifierSuppressionFichiers (event) {
			if (event.target.checked === true) {
				this.suppressionFichiers = true
			} else {
				this.suppressionFichiers = false
			}
		},
		exporterInteraction () {
			if (this.codeE !== '') {
				this.chargement = true
				axios.post(this.hote + '/api/exporter-interaction', {
					code: this.codeE,
					identifiant: '',
					admin: this.admin
				}).then(function (reponse) {
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
					} else if (donnees === 'erreur_donnees') {
						this.$store.dispatch('modifierMessage', this.$t('aucuneDonneesExport'))
					} else if (donnees === 'erreur_code') {
						this.$store.dispatch('modifierMessage', this.$t('codeNonValide'))
					} else if (donnees === 'non_autorise') {
						this.$store.dispatch('modifierMessage', this.$t('actionNonAutorisee'))
					} else {
						saveAs('/temp/' + donnees, this.codeE + '.zip')
					}
					this.chargement = false
					this.codeE = ''
				}.bind(this)).catch(function () {
					this.chargement = false
					this.codeE = ''
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		supprimerInteraction () {
			if (this.codeS !== '') {
				this.modale = ''
				this.chargement = true
				axios.post(this.hote + '/api/recuperer-donnees-interaction-admin', {
					code: this.codeS
				}).then(function (reponse) {
					this.chargement = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurActionServeur'))
					} else if (donnees === 'interaction_inexistante') {
						this.$store.dispatch('modifierMessage', this.$t('interactionInexistante'))
					} else {
						const identifiant = donnees.identifiant
						axios.post(this.hote + '/api/supprimer-interaction', {
							code: parseInt(this.codeS),
							identifiant: identifiant,
							admin: this.admin,
							suppressionFichiers: this.suppressionFichiers
						}).then(function (reponse) {
							this.chargement = false
							const donnees = reponse.data
							if (donnees === 'erreur_suppression') {
								this.$store.dispatch('modifierMessage', this.$t('erreurSuppressionInteraction'))
							} else {
								this.$store.dispatch('modifierNotification', this.$t('interactionSupprimee'))
								this.codeS = ''
								this.suppressionFichiers = true
							}
						}.bind(this)).catch(function () {
							this.chargement = false
							this.codeS = ''
							this.suppressionFichiers = true
							this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
						}.bind(this))
					}
				}.bind(this)).catch(function () {
					this.chargement = false
					this.codeS = ''
					this.suppressionFichiers = true
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		},
		supprimerCompte () {
			if (this.identifiantS !== '') {
				this.modale = ''
				this.chargement = true
				axios.post(this.hote + '/api/supprimer-compte', {
					identifiant: this.identifiantS,
					admin: this.admin
				}).then(function (reponse) {
					this.chargement = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.$store.dispatch('modifierMessage', this.$t('erreurActionServeur'))
					} else {
						this.$store.dispatch('modifierNotification', this.$t('compteSupprime'))
						this.identifiantS = ''
					}
				}.bind(this)).catch(function () {
					this.chargement = false
					this.$store.dispatch('modifierMessage', this.$t('erreurCommunicationServeur'))
				}.bind(this))
			}
		}
	}
}
</script>

<style scoped>
#page,
#accueil {
	width: 100%;
	height: 100%;
}

#page {
	overflow: auto;
}

#langues {
	position: fixed;
	display: flex;
	top: 1rem;
	right: 0.5rem;
	z-index: 10;
}

#langues span {
    display: flex;
    justify-content: center;
	align-items: center;
	font-size: 1.4rem;
    width: 3rem;
	height: 3rem;
	background: #fff;
    border-radius: 50%;
    border: 1px solid #ddd;
    margin-right: 1rem;
	cursor: pointer;
}

#langues span.selectionne {
    background: #242f3d;
    color: #fff;
    border: 1px solid #222;
    cursor: default;
}

#conteneur {
    width: 100%;
	max-width: 500px;
	margin: auto;
	padding-top: 5em;
	padding-bottom: 5em;
}

#conteneur h1 {
    font-family: 'HKGroteskWide-ExtraBold', 'HKGrotesk-ExtraBold', sans-serif;
    font-size: 2rem;
	font-weight: 900;
	margin: 0 1.5rem 0.85em;
    line-height: 1.4;
}

#conteneur .conteneur {
    margin: 2rem 1.5rem;
}

#conteneur .conteneur-bouton {
	font-size: 0;
}

#conteneur .conteneur label {
    font-size: 14px;
    display: block;
	margin-bottom: 10px;
	line-height: 1.15;
	font-weight: 700;
}

#conteneur .conteneur select,
#conteneur .conteneur input {
	display: block;
    width: 100%;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
	padding: 7px 15px;
	line-height: 1.5;
}

#conteneur .conteneur select {
	background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 29 14" width="29"><path fill="%23000000" d="M9.37727 3.625l5.08154 6.93523L19.54036 3.625" /></svg>') center right no-repeat;
	padding-right: 30px;
}

#conteneur .conteneur div {
    margin-bottom: 10px;
}

#conteneur .conteneur div:not(.conteneur-interrupteur):last-child {
    margin-bottom: 3rem;
}

#conteneur .conteneur .donnees {
	user-select: text!important;
	-webkit-user-select: text!important;
	-webkit-touch-callout: default!important;
}

#conteneur .actions {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: 4rem;
}

#conteneur .actions .bouton {
	display: inline-block;
	width: 180px;
    line-height: 1;
    font-size: 1em;
    font-weight: 700;
    text-transform: uppercase;
	text-align: center;
	padding: 1em 1.5em;
	margin-right: 1em;
    border: 2px solid #00ced1;
	border-radius: 2em;
    background: #46fbff;
	cursor: pointer;
    transition: all 0.1s ease-in;
}

#conteneur .actions .bouton.maintenance {
	width: 100%;
}

#conteneur .actions .bouton.maintenance:first-child {
	margin-right: 0;
	margin-bottom: 2rem;
}

#conteneur .actions .bouton:hover {
    color: #fff;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
	background: #00ced1;
}

#conteneur .actions .bouton:last-child {
	margin-right: 0;
}

#conteneur .conteneur-interrupteur {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	line-height: 2.2rem;
}

#conteneur .conteneur-interrupteur > span {
	font-size: 16px;
}

#conteneur .bouton-interrupteur {
	position: relative;
	display: inline-block!important;
	width: 3.8rem!important;
	height: 2.2rem;
	margin: 0!important;
}

#conteneur .bouton-interrupteur input {
	opacity: 0;
	width: 0;
	height: 0;
}

#conteneur .bouton-interrupteur .barre {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.2s;
	border-radius: 3rem;
}

#conteneur .bouton-interrupteur .barre:before {
	position: absolute;
	content: '';
	height: 1.6rem;
	width: 1.6rem;
	left: 0.3rem;
	bottom: 0.3rem;
	background-color: #fff;
	transition: 0.2s;
	border-radius: 50%;
}

#conteneur .bouton-interrupteur input:checked + .barre {
	background-color: #00ced1;
}

#conteneur .bouton-interrupteur input:focus + .barre {
	box-shadow: 0 0 1px #00ced1;
}

#conteneur .bouton-interrupteur input:checked + .barre:before {
	transform: translateX(1.6rem);
}

.alerte .modale .conteneur {
	padding: 30px 25px;
	text-align: center;
	max-width: 500px;
}

.alerte .message {
	font-size: 18px;
	line-height: 1.5;
}

.alerte .bouton {
	margin-top: 20px;
}

.alerte .modale .actions {
	font-size: 0;
}

.alerte .modale .actions span {
	min-width: 70px;
}

@media screen and (max-width: 359px) {
	#conteneur .actions .bouton {
		font-size: 0.75em!important;
		width: 130px;
		padding: 1em 0.5em;
	}
}

@media screen and (min-width: 360px) and (max-width: 599px) {
	#conteneur .actions .bouton {
		width: 145px;
	}
}

@media screen and (max-width: 399px) {
	#conteneur h1 span {
		display: block;
	}
}

@media screen and (max-width: 599px) {
	#conteneur h1 {
		font-size: 2em;
		margin-bottom: 1em;
	}

	#conteneur .actions .bouton {
		font-size: 0.85em;
		margin-bottom: 1em;
	}
}

@media screen and (max-width: 850px) and (max-height: 500px) {
	#conteneur h1 {
		font-size: 2em;
		margin-bottom: 1em;
	}

	#conteneur .actions .bouton {
		font-size: 0.85em!important;
	}
}
</style>

<style>
#message .message {
	user-select: text!important;
}
</style>
