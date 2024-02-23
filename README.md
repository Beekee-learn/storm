# Digistorm

Digistorm est une application en ligne pour créer des sondages, des questionnaires, des remue-méninges et des nuages de mots collaboratifs.

Pour l'affichage des nuages de mots, Digistorm utilise Vue Wordcloud (https://github.com/SeregPie/VueWordCloud), publié sous licence MIT.

Elle est publiée sous licence GNU AGPLv3.
Sauf les fontes Roboto Slab et Material Icons (Apache License Version 2.0) et la fonte HKGrotesk (Sil Open Font Licence 1.1)

### Préparation et installation des dépendances
```
npm install
```

### Lancement du serveur de développement sur localhost:3000
```
npm run dev
```

### Compilation, minification des fichiers et lancement du serveur de production
```
npm run prod
```

### Avec PM2
```
npm run build
pm2 start ecosystem.config.cjs
```

### Variables d'environnement pour la mise en production (fichier .env à créer à la racine du dossier)
```
DOMAIN (protocole + domaine. ex : https://digistorm.app)
HOST (IP publique du serveur de production)
PORT (port du serveur local / 3000 par défaut)
DB_HOST (IP publique du serveur de base de données Redis)
DB_PWD (mot de passe de la base de données Redis)
DB_PORT (port de la base de données Redis / 6379 par défaut)
SESSION_KEY (clé de session Express Session)
SESSION_DURATION (durée de la session de connexion des utilisateurs en millisecondes)
EMAIL_HOST (hôte pour l'envoi d'emails)
EMAIL_ADDRESS (adresse pour l'envoi d'emails)
EMAIL_PASSWORD (mot de passe de l'adresse emails)
EMAIL_PORT (port pour l'envoi d'emails)
EMAIL_SECURE (true ou false)
AUTHORIZED_DOMAINS (domaines autorisés pour api serveur. ex : ladigitale.dev,example.com / par défaut *)
VITE_ADMIN_PASSWORD (mot de passe pour accès page /admin)
```

### Projet Vue (Vue.js 3 et Vike) avec serveur Node.js (Express) et base de données Redis

### Démo
https://digistorm.app

### Remerciements et crédits
Traduction en espagnol par Fernando S. Delgado Trujillo (https://gitlab.com/fersdt)

Traduction en italien par Paolo Mauri (https://gitlab.com/maupao) et @nilocram (Roberto Marcolin)

### Soutien
Open Collective : https://opencollective.com/ladigitale

Liberapay : https://liberapay.com/ladigitale/

