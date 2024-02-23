export { render as onRenderHtml }

import { escapeInject } from 'vike/server'

function render (pageContext) {
	let titre = 'Digistorm by La Digitale'
	if (pageContext.pageProps.hasOwnProperty('titrePage')) {
		titre = pageContext.pageProps.titrePage
	}
	const documentHtml = escapeInject`<!DOCTYPE html>
		<html lang="fr">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, height=device-height, viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
				<meta name="apple-mobile-web-app-capable" content="yes">
				<meta name="mobile-web-app-capable" content="yes">
				<meta name="HandheldFriendly" content="true">
				<meta name="keywords" content="ladigitale, quizzes, wordclouds, surveys, brainstorming, education, openedtech, free software">
				<meta name="description" content="Un outil éducatif pour interagir en temps réel en présence ou à distance proposé par La Digitale">
				<meta name="robots" content="index, no-follow" />
				<meta name="theme-color" content="#00ced1">
				<meta property="og:title" content="${titre}">
				<meta property="og:description" content="Un outil éducatif pour interagir en temps réel en présence ou à distance proposé par La Digitale">
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://digistorm.app" />
				<meta property="og:image" content="https://digistorm.app/img/digistorm.png" />
				<meta property="og:locale" content="fr_FR" />
				<title>${titre}</title>
				<link rel="icon" type="image/png" href="/img/favicon.png">
			</head>
			<body>
				<noscript>
      				<strong>Veuillez activer Javascript dans votre navigateur pour utiliser <i>Digistorm</i>.</strong>
    			</noscript>
				<div id="app"></div>
				<script src="/js/qrcode.js"></script>
				<script src="/js/fitty.js"></script>
				<script src="/js/charger-mathjax.js"></script>
			</body>
		</html>`
  	return {
    	documentHtml
  	}
}
