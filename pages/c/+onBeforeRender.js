import axios from 'axios'

export { onBeforeRender }

async function onBeforeRender (pageContext) {
	let pageProps, erreur
	const hote = pageContext.hote
	const code = pageContext.routeParams.code
	const reponse = await axios.post(hote + '/api/recuperer-donnees-interaction', {
		code: code
	}, {
		headers: { 'Content-Type': 'application/json' }
	}).catch(function () {
		erreur = true
		pageProps = { erreur }
	})
	if (!reponse || !reponse.hasOwnProperty('data') || (reponse.data && reponse.data === 'erreur')) {
		erreur = true
		pageProps = { erreur }
	} else {
		let identifiant = pageContext.identifiant
		const params = pageContext.params
		const id = params.id
		const mdp = params.mdp
		if (id && id !== '' && mdp && mdp !== '') {
			identifiant = id
		}
		if (reponse.data.motdepasse === '' && reponse.data.identifiant !== identifiant) {
			erreur = true
			pageProps = { erreur }
		} else {
			const langues = pageContext.langues
			const nom = pageContext.nom
			const langue = pageContext.langue
			const role = pageContext.role
			const interactions = pageContext.interactions
			const digidrive = pageContext.digidrive
			const type = reponse.data.type
			const titre = reponse.data.titre
			const motdepasse = reponse.data.motdepasse
			const proprietaire = reponse.data.identifiant
			const donnees = reponse.data.donnees
			const reponses = reponse.data.reponses
			const sessions = reponse.data.sessions
			const statut = reponse.data.statut
			const session = reponse.data.session
			const titrePage = titre + ' - Digistorm by La Digitale'
			pageProps = { params, hote, langues, identifiant, nom, langue, role, interactions, digidrive, code, type, titre, motdepasse, proprietaire, donnees, reponses, sessions, statut, session, titrePage }
		}
	}
	return {
		pageContext: {
			pageProps
		}
	}
}
