import axios from 'axios'

export { onBeforeRender }

async function onBeforeRender (pageContext) {
	let pageProps, erreur
	const identifiant = pageContext.identifiant
	const reponse = await axios.post(pageContext.hote + '/api/recuperer-donnees-utilisateur', {
		identifiant: identifiant
	}, {
		headers: { 'Content-Type': 'application/json' }
	}).catch(function () {
		erreur = true
		pageProps = { erreur }
	})
	if (reponse.hasOwnProperty('data') || pageContext.role !== 'utilisateur') {
		const params = pageContext.params
		const hote = pageContext.hote
		const nom = pageContext.nom
		const email = pageContext.email
		const langue = pageContext.langue
		const role = pageContext.role
		const interactions = reponse.data.interactions
		const filtre = reponse.data.filtre
		const titrePage = identifiant + ' - Digistorm by La Digitale'
		pageProps = { params, hote, identifiant, nom, email, langue, role, interactions, filtre, titrePage }
	} else {
		erreur = true
		pageProps = { erreur }
	}
	return {
		pageContext: {
			pageProps
		}
	}
}
