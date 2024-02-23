import axios from 'axios'

export { onBeforeRender }

async function onBeforeRender (pageContext) {
	let pageProps, erreur
	const code = pageContext.routeParams.code
	const reponse = await axios.post(pageContext.hote + '/api/recuperer-donnees-interaction', {
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
		const params = pageContext.params
		const hote = pageContext.hote
		const langues = pageContext.langues
		const identifiant = pageContext.identifiant
		const nom = pageContext.nom
		const langue = pageContext.langue
		const type = reponse.data.type
		const titre = reponse.data.titre
		const donnees = reponse.data.donnees
		const reponses = reponse.data.reponses
		const statut = reponse.data.statut
		const session = reponse.data.session
		const titrePage = titre + ' - Digistorm by La Digitale'
		pageProps = { params, hote, langues, identifiant, nom, langue, code, type, titre, donnees, reponses, statut, session, titrePage }
	}
	return {
		pageContext: {
			pageProps
		}
	}
}
