import { Game } from "./scripts/Game";
import { InputHandler } from "./scripts/utils/InputHandler";
import { Player } from "./scripts/entities/Player";
import { RectangleGfx } from "./scripts/visuals/RectangleGfx";
import { Vector2 } from "./types";
import { SheepSpawner } from "./scripts/SheepSpawner";
import { YardCounter } from "./scripts/visuals/YardCounter";

export const game = new Game();
game.init("#304f31", "gameCanvas");

export const yardCounter = new YardCounter();
yardCounter.init();

//const sheepSpawner = new SheepSpawner(100, { min: 0.1, max: 0.3 }); //Uncomment this line to check the patrolling behavior
const sheepSpawner = new SheepSpawner(10, { min: 1, max: 3 });

const yardWidth = window.innerWidth / 3;
const yardHeight = window.innerHeight / 3;
export const yardArea = new RectangleGfx("#b3862e", {
    x: window.innerWidth / 2 - yardWidth / 2,
    y: 100,
    width: yardWidth,
    height: yardHeight
}, 0);
sheepSpawner.registerInvalidArea(yardArea.getDimensions());
game.addElement(yardArea.getGfx());

const playerRadius = 30;
const playerPos: Vector2 = {
    x: (window.innerWidth - playerRadius) / 2.0,
    y: (window.innerHeight - playerRadius) / 2.0
};
export const player = new Player("#ff0000", playerPos, playerRadius, 1000);
game.addElement(player.getGfx());
game.registerMover(player);

const inputHandler = new InputHandler();
inputHandler.subscribeOnClick((x: number, y: number) => {
    player.setDetination({ x: x, y: y });
});

