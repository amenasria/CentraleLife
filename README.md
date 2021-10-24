# Centrale Life

Centrale Life est un joueur de plateau inspiré de la vie centralienne. On peut y jouer en multijoueur grâce à un websocket.

## Technologies utilisées

### Vue.js

La partie front du projet est en [Vue.js](https://vuejs.org/). 
Vue.js est un framework JavaScript utilisé pour construire des interfaces utilisateur et des applications web monopages.

#### Créer un projet en Vue

Il y a plusieurs façons d'intégrer Vue à son projet :
- [CDN](https://vuejs.org/v2/guide/installation.html#CDN)
- [NPM](https://vuejs.org/v2/guide/installation.html#NPM)
- [CLI](https://vuejs.org/v2/guide/installation.html#CLI)

Pour ce projet, nous avons fait une application Vue CLI. 
Pour pouvoir en faire une, il faut [installer Vue sur votre ordinateur](https://cli.vuejs.org/guide/installation.html).
Pour [créer le projet](https://cli.vuejs.org/guide/creating-a-project.html#vue-create), il faut exécuter :

`vue create nameProject`



### Node.js et Express

La partie back en [Node.js](https://nodejs.org/en/) avec le framework [Express](https://expressjs.com/fr/).
Node.js est un environnement d'exécution permettant d'utiliser le JavaScript côté serveur.
Express est un framework pour construire des applications avec Node.js.

### Websocket

### Test

## Exécuter le projet

### Installer le projet

Après avoir cloné le dépôt, il faut exécuter les commandes suivantes :

```
npm install    # Backend dependecencies installation
cd front
npm install    # Frontend dependecencies installation
```


### Lancer le projet en mode développement


```
node server.js    # Run backend
```
```
cd front
npm run serve     # Starts a dev server (for the frontend)
```

### Production

Build vue project to ./front/dist static folder:
```
cd front
npm run build
```

Don't forget to uncomment the app.bind.... line which bind to the static front/dist folder

Then:
```
node server.js
```
