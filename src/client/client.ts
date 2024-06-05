import { Game } from "./scripts/Game";
import { InputHandler } from "./scripts/utils/InputHandler";
import { Player } from "./scripts/Player";
import { RectangleGfx } from "./scripts/visuals/RectangleGfx";
import { Vector2 } from "./types";

const game = new Game();
game.init("#1a4f1b", "gameCanvas");

const yardWidth = window.innerWidth / 3;
const yardHeight = window.innerHeight / 3;
const yardPos: Vector2 = {
    x: window.innerWidth / 2 - yardWidth / 2,
    y: 100
};
const yardArea = new RectangleGfx("#b3862e", yardPos, yardWidth, yardHeight);
game.addElement(yardArea.getGfx());

const playerRadius = 30;
const playerPos: Vector2 = {
    x: (window.innerWidth - playerRadius) / 2.0,
    y: (window.innerHeight - playerRadius) / 2.0
};
const player = new Player("#c72d22", playerPos, playerRadius, 1000);
game.addElement(player.getGfx());
game.registerMover(player);

const inputHandler = new InputHandler();
inputHandler.subscribeOnClick((x: number, y: number) => {
    player.setDetination({ x: x, y: y });
});
