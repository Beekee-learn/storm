<template>
	<div id="page">
		<div id="accueil" :style="{'background-image': 'url(./img/fond.png)'}">
			<div id="langues">
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'fr'}" @click="modifierLangue('fr')">FR</span>
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'es'}" @click="modifierLangue('es')">ES</span>
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'it'}" @click="modifierLangue('it')">IT</span>
				<span class="bouton" role="button" tabindex="0" :class="{'selectionne': langue === 'en'}" @click="modifierLangue('en')">EN</span>
			</div>
			<div id="conteneur">
				<div id="contenu">
					<h1>
						<span>Digistorm</span> <span>by La Digitale</span>
					</h1>
					<div>
						<p v-html="$t('slogan')" />
						<div id="actions">
							<span class="bouton" role="button" tabindex="0" @click="ouvrirModaleParticiper">{{ $t('participer') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ouvrirModaleCreer">{{ $t('creer') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ouvrirModaleSeConnecter">{{ $t('seConnecter') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ouvrirModaleSInscrire">{{ $t('sInscrire') }}</span>
						</div>
					</div>
				</div>
				<div id="credits">
					<p><span class="mentions-legales" @click="modale = 'mentions-legales'">{{ $t('mentionsLegales') }}</span> - <a href="https://opencollective.com/ladigitale" target="_blank">{{ $t('soutien') }} ❤️.</a></p>
					<p>{{ new Date().getFullYear() }} - <a href="https://ladigitale.dev" target="_blank" rel="noreferrer">La Digitale</a> - <a href="https://codeberg.org/ladigitale/digistorm" target="_blank" rel="noreferrer">{{ $t('codeSource') }}</a> - <a href="https://codeberg.org/ladigitale/digistorm/releases" target="_blank" rel="noreferrer">v{{ version }}</a> - <span class="hub" @click="ouvrirHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#001d1d" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none" /><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" /></svg></span></p>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" role="dialog" tabindex="-1" v-if="modale === 'participer'">
			<div id="participer" class="modale" role="document">
				<header>
					<span class="titre">{{ $t('participerInteraction') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModaleParticiper"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-code-interaction">{{ $t('codeInteraction') }}</label>
						<input id="champ-code-interaction" type="text" v-model="code" @keydown.enter="participer">
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="participer">{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" role="dialog" tabindex="-1" v-else-if="modale === 'creer'">
			<div id="creer" class="modale" role="document">
				<header>
					<span class="titre">{{ $t('creerInteraction') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModaleCreer"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-titre-interaction">{{ $t('titre') }}</label>
						<input id="champ-titre-interaction" type="text" v-model="titre" @keydown.enter="creer">
						<label for="champ-type-interaction">{{ $t('typeInteraction') }}</label>
						<select id="champ-type-interaction" value="Sondage" @change="type = $event.target.value">
							<option value="Sondage">{{ $t('sondage') }}</option>
							<option value="Questionnaire">{{ $t('questionnaire') }}</option>
							<option value="Remue-méninges">{{ $t('remueMeninges') }}</option>
							<option value="Nuage-de-mots">{{ $t('nuageDeMots') }}</option>
						</select>
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="creer" v-if="!chargementModale">{{ $t('creer') }}</span>
							<div class="conteneur-chargement" v-else>
								<div class="chargement" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" role="dialog" tabindex="-1" v-else-if="modale === 'se-connecter' || modale === 'mot-de-passe-oublie' || modale === 'se-connecter-interaction'">
			<div id="se-connecter" class="modale" role="document" v-if="modale === 'se-connecter'">
				<header>
					<span class="titre">{{ $t('seConnecter') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModaleSeConnecter"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-identifiant">{{ $t('identifiant') }}</label>
						<input id="champ-identifiant" type="text" maxlength="48" v-model="identifiant" @keydown.enter="seConnecter">
						<label for="champ-motdepasse">{{ $t('motDePasse') }}</label>
						<input id="champ-motdepasse" type="password" maxlength="48" v-model="motDePasse" @keydown.enter="seConnecter">
						<div class="mot-de-passe-oublie" @click="ouvrirModaleMotDePasseOublie" v-html="$t('motDePasseOublie')" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="seConnecter" v-if="!chargementModale">{{ $t('valider') }}</span>
							<div class="conteneur-chargement" v-else>
								<div class="chargement" />
							</div>
						</div>
						<p class="connexion" @click="ouvrirModaleSeConnecterInteraction" v-if="!chargementModale">{{ $t('cliquezConnexionInteraction') }}</p>
					</div>
				</div>
			</div>

			<div class="modale" role="document" v-else-if="modale === 'mot-de-passe-oublie'">
				<header>
					<span class="titre">{{ $t('motDePasseOublie') }}</span>
					<span class="fermer" @click="fermerModaleMotDePasseOublie"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-identifiant">{{ $t('identifiant') }}</label>
						<input id="champ-identifiant" type="text" maxlength="48" v-model="identifiant">
						<label for="champ-email">{{ $t('email') }}</label>
						<input id="champ-email" type="text" v-model="email" @keydown.enter="envoyerMotDePasse">
						<div class="actions">
							<span role="button" tabindex="0" class="bouton" @click="envoyerMotDePasse" v-if="!chargementModale">{{ $t('valider') }}</span>
							<div class="conteneur-chargement" v-else>
								<div class="chargement" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="se-connecter" class="modale" role="document" v-else-if="modale === 'se-connecter-interaction'">
				<header>
					<span class="titre">{{ $t('consulterInteraction') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModaleSeConnecterInteraction"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-code-interaction">{{ $t('codeInteraction') }}</label>
						<input id="champ-code-interaction" type="text" v-model="code" @keydown.enter="seConnecterInteraction">
						<label for="champ-motdepasse">{{ $t('motDePasseAdministration') }}</label>
						<input id="champ-motdepasse" type="text" v-model="motdepasse" @keydown.enter="seConnecterInteraction">
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="seConnecterInteraction" v-if="!chargementModale">{{ $t('valider') }}</span>
							<div class="conteneur-chargement" v-else>
								<div class="chargement" />
							</div>
						</div>
						<p class="connexion" @click="ouvrirModaleSeConnecter">{{ $t('cliquezConnexionCompte') }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" role="dialog" tabindex="-1" v-else-if="modale === 's-inscrire'">
			<div id="s-inscrire" class="modale" role="document">
				<header>
					<span class="titre">{{ $t('sInscrire') }}</span>
					<span class="fermer" role="button" tabindex="0" @click="fermerModaleSInscrire"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<label for="champ-identifiant">{{ $t('identifiant') }}</label>
						<p class="information">{{ $t('infoIdentifiant') }}</p>
						<input id="champ-identifiant" type="text" maxlength="48" v-model="identifiant">
						<label for="champ-email">{{ $t('email') }}</label>
						<input id="champ-email" type="text" v-model="email">
						<label for="champ-motdepasse">{{ $t('motDePasse') }}</label>
						<p class="information">{{ $t('infoMotDePasse') }}</p>
						<input id="champ-motdepasse" type="password" maxlength="48" v-model="motDePasse">
						<label for="champ-confirmation-motdepasse">{{ $t('confirmationMotDePasse') }}</label>
						<input id="champ-confirmation-motdepasse" type="password" maxlength="48" v-model="confirmationMotDePasse" @keydown.enter="sInscrire">
						<div class="actions">
							<span role="button" tabindex="0" class="bouton" @click="sInscrire" v-if="!chargementModale">{{ $t('valider') }}</span>
							<div class="conteneur-chargement" v-else>
								<div class="chargement" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="conteneur-modale" role="dialog" tabindex="-1" v-else-if="modale === 'mentions-legales'">
			<div id="mentions-legales" class="modale" role="document">
				<header>
					<span class="titre">{{ $t('mentionsLegales') }}</span>
					<span class="fermer" @click="modale = ''"><i class="material-icons">close</i></span>
				</header>
				<div class="conteneur">
					<div class="contenu">
						<p>{{ $t('mentionsLegales1') }}</p>
						<label>{{ $t('administrationEtDeveloppement') }}</label>
						<p>La Digitale - Emmanuel ZIMMERT</p>
						<label>{{ $t('contact') }}</label>
						<p>{{ $t('courriel') }} ez@ladigitale.dev – {{ $t('siteWeb') }} https://ladigitale.dev</p>
						<label>{{ $t('proprieteIntellectuelle') }}</label>
						<p>{{ $t('mentionsLegales2') }}</p>
						<p>{{ $t('mentionsLegales3') }}</p>
						<label>{{ $t('politiqueConfidentialite') }}</label>
						<p>{{ $t('mentionsLegales4') }}</p>
						<p>{{ $t('mentionsLegales5') }}</p>
						<label>{{ $t('hebergement') }}</label>
						<p>{{ $t('mentionsLegales6') }}</p>
					</div>
				</div>
			</div>
		</div>

		<div id="hub" :class="{'ouvert': hub}">
			<span @click="fermerHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg></span>
			<iframe src="https://ladigitale.dev/hub.html" />
		</div>

		<Notification :notification="notification" @fermer="notification = ''" v-if="notification !== ''" />

		<Message :message="message" @fermer="message = ''" v-if="message !== ''" />

		<Chargement v-if="chargement" />

		<ChargementPage v-if="chargementPage" />
	</div>
</template>

<script>
import axios from 'axios'
import ChargementPage from '#root/components/chargement-page.vue'
import Chargement from '#root/components/chargement.vue'
import Message from '#root/components/message.vue'
import Notification from '#root/components/notification.vue'

export default {
	name: 'Accueil',
	components: {
		ChargementPage,
		Chargement,
		Message,
		Notification
	},
	data () {
		return {
			chargementPage: true,
			chargement: false,
			message: '',
			notification: '',
			modale: '',
			titre: '',
			type: 'Sondage',
			code: '',
			motdepasse: '',
			identifiant: '',
			motDePasse: '',
			confirmationMotDePasse: '',
			email: '',
			chargementModale: false,
			hub: false,
			hote: this.$pageContext.pageProps.hote,
			langues: this.$pageContext.pageProps.langues,
			langue: this.$pageContext.pageProps.langue,
			version: app_version
		}
	},
	created () {
		const params = this.$pageContext.pageProps.params
		const langue = params.lang
		if (langue && this.langues.includes(langue) === true) {
			this.$i18n.locale = langue
			this.langue = langue
			this.$socket.emit('modifierlangue', langue)
		} else {
			this.$i18n.locale = this.langue
		}
	},
	mounted () {
		document.getElementsByTagName('html')[0].setAttribute('lang', this.langue)

		setTimeout(function () {
			this.chargementPage = false
		}.bind(this), 300)
	},
	methods: {
		ouvrirModaleCreer () {
			this.modale = 'creer'
			this.$nextTick(function () {
				document.querySelector('#creer input').focus()
			})
		},
		fermerModaleCreer () {
			this.modale = ''
			this.titre = ''
			this.type = 'Sondage'
		},
		creer () {
			if (this.titre.trim() !== '' && this.type !== '') {
				this.chargementModale = true
				axios.post(this.hote + '/api/creer-interaction-sans-compte', {
					titre: this.titre.trim(),
					type: this.type
				}).then(function (reponse) {
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.chargementModale = false
						this.fermerModaleCreer()
						this.message =  this.$t('erreurCommunicationServeur')
					} else if (donnees === 'existe_deja') {
						this.chargementModale = false
						this.fermerModaleCreer()
						this.message = this.$t('interactionExisteDeja')
					} else {
						window.location.href = '/c/' + donnees.code
					}
				}.bind(this)).catch(function () {
					this.chargementModale = false
					this.fermerModaleCreer()
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else if (this.titre.trim() === '') {
				this.message = this.$t('completerChampTitre')
			} else if (this.type === '') {
				this.message = this.$t('selectionnerTypeInteraction')
			}
		},
		ouvrirModaleParticiper () {
			this.modale = 'participer'
			this.$nextTick(function () {
				document.querySelector('#participer input').focus()
			})
		},
		fermerModaleParticiper () {
			this.modale = ''
			this.code = ''
		},
		participer () {
			if (this.code !== '') {
				this.chargement = true
				axios.post(this.hote + '/api/rejoindre-interaction', {
					code: this.code
				}).then(function (reponse) {
					const donnees = reponse.data
					if (donnees === 'erreur_code') {
						this.chargement = false
						this.message = this.$t('codeNonValide')
					} else if (donnees === 'erreur') {
						this.chargement = false
						this.message = this.$t('erreurCommunicationServeur')
					} else {
						window.location.href = '/p/' + donnees.code
					}
					this.fermerModaleParticiper()
				}.bind(this)).catch(function () {
					this.chargement = false
					this.fermerModaleParticiper()
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else {
				this.message = this.$t('indiquerCodeInteraction')
			}
		},
		ouvrirModaleSeConnecter () {
			this.modale = 'se-connecter'
			this.$nextTick(function () {
				document.querySelector('#se-connecter input').focus()
			})
		},
		fermerModaleSeConnecter () {
			this.modale = ''
			this.identifiant = ''
			this.motDePasse = ''
			this.code = ''
			this.motdepasse = ''
		},
		seConnecter () {
			if (this.identifiant !== '' && this.motDePasse !== '') {
				this.chargementModale = true
				axios.post(this.hote + '/api/se-connecter', {
					identifiant: this.identifiant,
					motdepasse: this.motDePasse
				}).then(function (reponse) {
					const donnees = reponse.data
					if (donnees === 'erreur_connexion') {
						this.chargementModale = false
						this.message = this.$t('informationsConnexionIncorrectes')
					} else {
						window.location.href = '/u/' + donnees.identifiant
					}
				}.bind(this)).catch(function () {
					this.chargementModale = false
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else {
				this.message = this.$t('remplirChamps')
			}
		},
		ouvrirModaleSInscrire () {
			this.modale = 's-inscrire'
			this.$nextTick(function () {
				document.querySelector('#s-inscrire input').focus()
			})
		},
		fermerModaleSInscrire () {
			this.modale = ''
			this.identifiant = ''
			this.motDePasse = ''
			this.confirmationMotDePasse = ''
		},
		sInscrire () {
			if (this.identifiant.trim() !== '' && this.motDePasse.trim() !== '' && this.motDePasse.trim() === this.confirmationMotDePasse.trim() && this.email.trim() !== '' && this.$verifierEmail(this.email.trim()) === true) {
				this.chargementModale = true
				axios.post(this.hote + '/api/s-inscrire', {
					identifiant: this.identifiant.trim(),
					motdepasse: this.motDePasse.trim(),
					email: this.email.trim()
				}).then(function (reponse) {
					const donnees = reponse.data
					if (donnees === 'utilisateur_existe_deja') {
						this.chargementModale = false
						this.message = this.$t('identifiantExisteDeja', { identifiant: this.identifiant.trim() })
					} else {
						window.location.href = '/u/' + donnees.identifiant
					}
				}.bind(this)).catch(function () {
					this.chargementModale = false
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else if (this.identifiant.trim() === '' || this.motDePasse.trim() === '' || this.confirmationMotDePasse.trim() === '' || this.email.trim() === '') {
				this.message = this.$t('remplirChamps')
			} else if (this.motDePasse.trim() !== this.confirmationMotDePasse.trim()) {
				this.message = this.$t('motsDePassePasIdentiques')
			} else if (this.$verifierEmail(this.email.trim()) === false) {
				this.message = this.$t('erreurEmail')
			}
		},
		ouvrirModaleSeConnecterInteraction () {
			this.modale = 'se-connecter-interaction'
			this.$nextTick(function () {
				document.querySelector('#se-connecter input').focus()
			})
		},
		fermerModaleSeConnecterInteraction () {
			this.modale = ''
			this.code = ''
			this.motdepasse = ''
			this.identifiant = ''
			this.motDePasse = ''
		},
		seConnecterInteraction () {
			if (this.code !== '' && this.motdepasse !== '') {
				this.chargementModale = true
				axios.post(this.hote + '/api/se-connecter-interaction', {
					code: this.code,
					motdepasse: this.motdepasse
				}).then(function (reponse) {
					this.chargementModale = false
					const donnees = reponse.data
					if (donnees === 'erreur_code') {
						this.message = this.$t('codeNonValide')
					} else if (donnees === 'erreur') {
						this.message = this.$t('erreurCommunicationServeur')
					} else if (donnees === 'non_autorise') {
						this.message = this.$t('pasAutoriseModifierInteraction')
					} else {
						window.location.href = '/c/' + donnees.code
					}
					this.fermerModaleSeConnecter()
				}.bind(this)).catch(function () {
					this.chargementModale = false
					this.fermerModaleSeConnecter()
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else {
				if (this.code === '') {
					this.message = this.$t('indiquerCodeInteraction')
				} else if (this.motdepasse === '') {
					this.message = this.$t('indiquerMotDePasse')
				}
			}
		},
		ouvrirModaleMotDePasseOublie () {
			this.motDePasse = ''
			this.code = ''
			this.motdepasse = ''
			this.modale = 'mot-de-passe-oublie'
			this.$nextTick(function () {
				document.querySelector('input').focus()
			})
		},
		envoyerMotDePasse () {
			if (this.identifiant.trim() !== '' && this.email.trim() !== '' && this.$verifierEmail(this.email.trim()) === true) {
				this.chargementModale = true
				axios.post(this.hote + '/api/mot-de-passe-oublie', {
					identifiant: this.identifiant.trim(),
					email: this.email.trim()
				}).then(function (reponse) {
					this.chargementModale = false
					const donnees = reponse.data
					if (donnees === 'erreur') {
						this.message = this.$t('erreurCommunicationServeur')
					} else if (donnees === 'identifiant_invalide') {
						this.message = this.$t('identifiantNonValide')
					} else if (donnees === 'email_invalide') {
						this.message = this.$t('emailNonValide')
					} else {
						this.fermerModaleMotDePasseOublie()
						this.notification = this.$t('emailEnvoye')
					}
				}.bind(this)).catch(function () {
					this.chargementModale = false
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			} else if (this.identifiant.trim() === '' || this.email.trim() === '') {
				this.message = this.$t('remplirChamps')
			} else if (this.$verifierEmail(this.email.trim()) === false) {
				this.message = this.$t('erreurEmail')
			}
		},
		fermerModaleMotDePasseOublie () {
			this.modale = ''
			this.identifiant = ''
			this.email = ''
		},
		modifierLangue (langue) {
			if (this.langue !== langue) {
				this.chargement = true
				axios.post(this.hote + '/api/modifier-langue', {
					langue: langue
				}).then(function () {
					this.$i18n.locale = langue
					document.getElementsByTagName('html')[0].setAttribute('lang', langue)
					this.langue = langue
					this.notification = this.$t('langueModifiee')
					this.chargement = false
				}.bind(this)).catch(function () {
					this.chargement = false
					this.message = this.$t('erreurCommunicationServeur')
				}.bind(this))
			}
		},
		ouvrirHub () {
			this.hub = true
		},
		fermerHub () {
			this.hub = false
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

#accueil {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
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
    border-radius: 50%;
    border: 1px solid #ddd;
	background: #fff;
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
	position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
	flex-wrap: wrap;
	overflow: auto;
}

#contenu {
	max-width: 76em;
	text-align: center;
	padding: 12em 1em 6em;
	margin: auto;
}

#conteneur h1 {
    font-family: 'HKGroteskWide-ExtraBold', 'HKGrotesk-ExtraBold', sans-serif;
    font-size: 3em;
	font-weight: 900;
    margin-bottom: 0.85em;
    line-height: 1.4;
}

#conteneur p {
    font-size: 1.25em;
    line-height: 1.4;
    margin-bottom: 1.5em;
}

#actions {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

#actions .bouton {
	display: inline-block;
	width: 180px;
    line-height: 1;
    font-size: 1em;
    font-weight: 700;
    text-transform: uppercase;
	padding: 1em 1.5em;
	margin-right: 1em;
    border: 2px solid #00ced1;
	border-radius: 2em;
    background: #46fbff;
    cursor: pointer;
    transition: all ease-in 0.1s;
}

#actions .bouton:hover {
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
	background: #fff;
}

#actions .bouton:last-child {
	margin-right: 0;
}

#credits {
	width: 100%;
	margin: 0 auto 0.75em;
}

#credits p {
    font-size: 1em;
    line-height: 1.2;
    margin-bottom: 1em;
	text-align: center;
}

#credits p:last-child {
	display: flex;
	justify-content: center;
	align-items: center;
}

#credits p:last-child a {
	margin: 0 5px;
}

#credits .mentions-legales {
	cursor: pointer;
}

#credits .hub {
	font-size: 0;
	cursor: pointer;
}

#hub {
	position: fixed;
	visibility: hidden;
	opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
	z-index: -1;
}

#hub.ouvert {
	visibility: visible;
	opacity: 1;
    animation: fonduEntrant linear 0.1s;
	z-index: 100000;
}

#hub iframe {
	width: 100%;
    height: 100%;
}

#hub span {
	font-size: 0;
	color: #fff;
	position: absolute;
	top: 15px;
	right: 15px;
	cursor: pointer;
}

#mentions-legales {
	max-width: 700px;
	height: 500px;
	max-height: 90%;
}

.modale p.connexion {
	font-size: 14px;
	text-decoration: underline;
	text-align: center;
	margin-top: 20px;
	margin-bottom: 0;
	cursor: pointer;
}

#se-connecter #champ-motdepasse {
	margin-bottom: 10px;
}

.modale .contenu .mot-de-passe-oublie {
	font-size: 12px;
    margin-bottom: 20px;
	cursor: pointer;
}

@media screen and (orientation: landscape) and (max-height: 359px) {
	#creer {
		height: 90%;
	}
}

@media screen and (orientation: landscape) and (max-height: 399px) {
	#se-connecter {
		height: 90%;
	}
}

@media screen and (orientation: landscape) and (max-height: 479px) {
	#s-inscrire {
		height: 90%;
	}
}

@media screen and (max-width: 359px) {
	#contenu {
		padding: 4em 1em 2em;
	}

	#actions .bouton {
		font-size: 0.75em!important;
		width: 130px;
		padding: 1em 0.5em;
	}
}

@media screen and (min-width: 360px) and (max-width: 599px) {
	#contenu {
		padding: 5em 1em 2.5em;
	}

	#actions .bouton {
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

	#conteneur p {
		font-size: 1em;
		margin-bottom: 1.2em;
	}

	#actions .bouton {
		font-size: 0.85em;
	}

	#credits p {
		font-size: 0.85em;
	}

	#hub span {
		top: 5px;
		right: 5px;
	}

	#hub span svg {
		width: 24px;
		height: 24px;
	}
}

@media screen and (max-width: 599px) and (orientation: landscape) {
	#contenu {
		padding: 2em 1em 1.5em!important;
	}
}

@media screen and (min-width: 600px) and (max-width: 820px) and (orientation: landscape) {
	#contenu {
		padding: 3em 1em 1.5em!important;
	}
}

@media screen and (max-width: 820px) and (orientation: landscape) {
	#conteneur p {
		font-size: 1em!important;
	}

	#credits p {
		font-size: 0.85em!important;
		margin-bottom: 0.85em!important;
	}
}

@media screen and (max-width: 1023px) {
	#actions .bouton {
		width: 45%;
		margin-bottom: 1em;
	}

	#actions .bouton:nth-child(2n) {
		margin-right: 0;
	}
}

@media screen and (max-width: 1023px) and (orientation: landscape) {
	#contenu {
		padding: 7em 1em 3.5em;
	}
}

@media screen and (max-width: 850px) and (max-height: 500px) {
	#conteneur h1 {
		font-size: 2em;
		margin-bottom: 1em;
	}

	#conteneur p {
		font-size: 1em;
		margin-bottom: 1.2em;
	}

	#credits p {
		font-size: 0.85em;
	}

	#actions .bouton {
		font-size: 0.85em!important;
	}
}
</style>
