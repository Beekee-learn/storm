export { onBeforeRender }

function onBeforeRender (pageContext) {
	const params = pageContext.params
	const hote = pageContext.hote
	const langue = pageContext.langue
	const titrePage = 'Admin - Digistorm by La Digitale'
	const pageProps = { params, hote, langue, titrePage }
	return {
		pageContext: {
			pageProps
		}
	}
}
