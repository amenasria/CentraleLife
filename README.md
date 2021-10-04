# Centrale Life

## Project setup
```
npm install    # Backend dependecencies installation
cd front
npm install    # Frontend dependecencies installation
```


## Development

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
