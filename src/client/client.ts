import { Game } from "./scripts/Game";
import { RectangleGfx } from "./scripts/visuals/RectangleGfx";

const game = new Game();
game.init("#1a4f1b", "gameCanvas");

const yardWidth = window.innerWidth / 3;
const yardHeight = window.innerHeight / 3;
const yardX = window.innerWidth / 2 - yardWidth / 2;
const yardY = 100;

const yardArea = new RectangleGfx("#b3862e", yardX, yardY, yardWidth, yardHeight);
game.addElement(yardArea.getGfx());
