import { Application, Container, Graphics, Ticker } from "pixi.js";
import { IMover } from "./interfaces/IMover";

export class Game
{
    private _app: Application;

    private _movementQueue: IMover[] = [];

    constructor()
    {
        this._app = new Application();
    }

    public async init(bgColor: string, canvasId: string)
    {
        await this._app.init({ 
            background: bgColor, 
            resizeTo: window, 
            canvas: document.getElementById(canvasId) as HTMLCanvasElement 
        });
        this._app.ticker.add((time: Ticker) => { this.gameLoop(time); });

        //window.addEventListener("resize", () => { this._onResize(); });
    }

    public gameLoop(time: Ticker)
    {
        for(let index = 0; index < this._movementQueue.length; ++index)
        {
            if(this._movementQueue[index].reachedDestination() == false)
            {
                this._movementQueue[index].move(time.deltaMS / 1000);
            }
        }
    }

    public addElement(elem: Graphics | Container)
    {
        this._app.stage.addChild(elem);
    }

    public registerMover(mover: IMover)
    {
        this._movementQueue.push(mover);
    }

    private _onResize()
    {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);

    }
}