let hote = 'http://localhost:3000'
if (process.env.NODE_ENV === 'production') {
	hote = process.env.DOMAIN
}

export const state = () => ({
	hote: hote,
	userAgent: '',
	message: '',
	notification: '',
	identifiant: '',
	nom: '',
	langue: 'en',
	langues: ['fr', 'es', 'en'],
	statut: '',
	interactions: []
})

export const mutations = {
	modifierUserAgent (state, donnees) {
		state.userAgent = donnees
	},
	modifierMessage (state, message) {
		state.message = message
	},
	modifierNotification (state, notification) {
		state.notification = notification
	},
	modifierIdentifiant (state, identifiant) {
		state.identifiant = identifiant
	},
	modifierNom (state, nom) {
		state.nom = nom
	},
	modifierLangue (state, langue) {
		state.langue = langue
	},
	modifierStatut (state, statut) {
		state.statut = statut
	},
	modifierInteractions (state, interactions) {
		state.interactions = interactions
	}
}

export const actions = {
	modifierUserAgent ({ commit }, userAgent) {
		commit('modifierUserAgent', userAgent)
	},
	modifierMessage ({ commit }, message) {
		commit('modifierMessage', message)
	},
	modifierNotification ({ commit }, notification) {
		commit('modifierNotification', notification)
	},
	modifierIdentifiant ({ commit }, identifiant) {
		commit('modifierIdentifiant', identifiant)
	},
	modifierNom ({ commit }, nom) {
		commit('modifierNom', nom)
	},
	modifierLangue ({ commit }, langue) {
		commit('modifierLangue', langue)
	},
	modifierUtilisateur ({ commit }, donnees) {
		commit('modifierIdentifiant', donnees.identifiant)
		commit('modifierNom', donnees.nom)
		commit('modifierLangue', donnees.langue)
		commit('modifierStatut', donnees.statut)
		if (donnees.hasOwnProperty('interactions')) {
			commit('modifierInteractions', donnees.interactions)
		}
	},
	reinitialiser ({ commit }) {
		commit('modifierIdentifiant', '')
		commit('modifierNom', '')
		commit('modifierLangue', 'en')
		commit('modifierStatut', '')
	}
}
