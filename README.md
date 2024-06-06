# Herdsman

Pixi.js-based game in the browser, in which you control a farmer by clicking on the screen and in which you need to move sheeps to a yard.

## Install instructions

1. Clone the repository
2. Download [Node.js](https://nodejs.org/en/download/package-manager)
3. Make sure that Node.js is added as an environment variable on your operating system (example path: `C:\Users\ionut\AppData\Roaming\npm`) (on windows, you can check this if you open CMD/Powershell and type `npm -v`)
4. Open cmd/powershell at the location where you cloned the repository
5. Type `npm install` in order to install all of the dependencies for this game
6. Type `npm run dev`

This should open up a link in your default browser, where you can run the game (if it doesn't open, write this into your url: `localhost:8080`). Click on the screen, and the player will move to the location you clicked. If you get close to the sheeps, they will start following you, and you need to move them to the yard (the brown/yellow-ish area on the screen).

## Technologies used

- Node.js
- Webpack
- Pixi.js
- Typescript
- HTML
- CSS
