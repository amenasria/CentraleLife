# Centrale Life

## Technologies utilisées

La partie front du projet est en [Vue.js](https://vuejs.org/) et la partie back en [Node.js](https://nodejs.org/en/) avec le framework [Express](https://expressjs.com/fr/).

## Installer le projet

Après avoir cloner le dépôt, il faut exécuter les commandes suivantes :

```
npm install    # Backend dependecencies installation
cd front
npm install    # Frontend dependecencies installation
```


## Lancer le projet en mode développement


```
node server.js    # Run backend
```
```
cd front
npm run serve     # Starts a dev server (for the frontend)
```

## Production

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
