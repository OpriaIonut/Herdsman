import { Application, Container, Graphics, Ticker } from "pixi.js";

export class Game
{
    private _app: Application;

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
        
    }

    public addElement(elem: Graphics | Container)
    {
        this._app.stage.addChild(elem);
    }

    private _onResize()
    {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);

    }
}