import { Application, Container, Graphics, Ticker } from "pixi.js";
import { IMover } from "./interfaces/IMover";
import { IAgentBehavior } from "./interfaces/IAgentBehavior";

//Class responsible for creating the application and handling any application-related workd (game loop, initialization flow, resizing, etc.)
export class Game
{
    private _app: Application;

    private _movementQueue: IMover[] = []; //Queue which will hold all objects that can move in the game, in order to update them in the game loop
    private _agentBehaviorQueue: IAgentBehavior[] = []; //Queue which will hold all ai agents in the game, in order to update them in the game loop

    constructor()
    {
        this._app = new Application();
    }

    public async init(bgColor: string, canvasId: string)
    {
        //Initialize the app, and start the game loop
        await this._app.init({ 
            background: bgColor, 
            resizeTo: window, 
            canvas: document.getElementById(canvasId) as HTMLCanvasElement 
        });
        this._app.ticker.add((time: Ticker) => { this.gameLoop(time); });
    }

    public gameLoop(time: Ticker)
    {
        let deltaTime = time.deltaMS / 1000;

        //Update all of the ai agents
        for(let index = 0; index < this._agentBehaviorQueue.length; ++index)
        {
            this._agentBehaviorQueue[index].updateAgent(deltaTime);
        }

        //Update all of the movers
        for(let index = 0; index < this._movementQueue.length; ++index)
        {
            if(this._movementQueue[index].reachedDestination() == false)
            {
                this._movementQueue[index].move(deltaTime);
            }
        }
    }

    //Add pixi.js elements to the game view, in order to be rendered
    public addElement(elem: Graphics | Container)
    {
        this._app.stage.addChild(elem);
    }

    //Add a mover to the queue
    public registerMover(mover: IMover)
    {
        this._movementQueue.push(mover);
    }

    //Add an agent to the queue
    public registerAgent(agent: IAgentBehavior)
    {
        this._agentBehaviorQueue.push(agent);
    }
}