import { Vector2 } from "../../types";
import { MathUtils } from "../utils/MathUtils";
import { IMover } from "../interfaces/IMover";
import { CircleGfx } from "../visuals/CircleGfx";
import { AgentState, IAgentBehavior } from "../interfaces/IAgentBehavior";
import { player, yardArea, yardCounter } from "../../client";
import { Assets, Sprite, Texture } from "pixi.js";

//Class which describes the visuals and the functionality for a sheep
export class Sheep implements IMover, IAgentBehavior
{
    public position = { x: 0, y: 0 };
    public destination = { x: 0, y: 0 };
    public speed = 10;
    public agentState: AgentState = AgentState.Patrolling;

    private _initialPosition: Vector2;
    private _reachThreshold = 10.0;
    private _radius: number;
    //private _gfx: CircleGfx;
    private _gfx: Sprite;

    //Config which holds the properties required for the patrolling behavior
    private _aiPatrollingConfig = {
        cooldown: 3,
        waitTime: 3,
        patrollingRadius: 400
    }
    private _aiFollowThreshold: number = 100;

    //Static variables to keep track of how many sheeps are curently following the player
    private static _agentsFollowingPlayer: number = 0;
    private static _maxAgentsFollowingPlayer: number = 5;
    private static _sheepTexture?: Texture; //Currently am saving the texture statically as a member of the class, in order to not load it multiple times

    constructor(bgColor: string, pos: Vector2, radius: number, speed: number)
    {
        this.position = pos;
        this.destination = this.position;
        this.speed = speed;
        this._radius = radius;

        this._initialPosition = { x: pos.x, y: pos.y };
        //this._gfx = new CircleGfx(bgColor, this.position, radius, 1);

        this._gfx = new Sprite();
        this.loadSprite();
    }
    
    private async loadSprite()
    {
        //If we haven't loaded the sheep texture, load it
        if(Sheep._sheepTexture == undefined)
            Sheep._sheepTexture = await Assets.load("ui/Sheep.png");

        //Initialize the graphics for the sheep
        this._gfx.texture = Sheep._sheepTexture as Texture;
        this._gfx.zIndex = 1;
        this._gfx.position.x = this.position.x;
        this._gfx.position.y = this.position.y;
        this._gfx.width = this._radius * 3;
        this._gfx.height = this._radius * 3;
        this._gfx.anchor.set(0.5);
    }

    //Run the ai logic for this given agent
    public updateAgent(deltaTime: number): void 
    {
        //Pick the actions required, based on the current state of the agent
        switch(this.agentState)
        {
            case AgentState.Patrolling:
                this.aiPatrollingBehavior(deltaTime);
                break;
            case AgentState.FollowingPlayer:
                this.aiFollowingPlayerBehavior();
                break;
            case AgentState.InYard:
                //Intentionally left empty
                break;
        }
    }

    public setDetination(pos: Vector2): void 
    {
        this.destination = pos;
    }

    public move(deltaTime: number): void
    {
        //Pick the direction that we need to move towards, and normalize it to simplify the calculations
        let moveDir = {
            x: this.destination.x - this.position.x,
            y: this.destination.y - this.position.y
        };
        moveDir = MathUtils.normalize(moveDir);

        //Move the object in the set direction while taking into account the speed of the sheep
        this.position.x += moveDir.x * this.speed * deltaTime;
        this.position.y += moveDir.y * this.speed * deltaTime;
        
        //Update the position of the graphics for it
        this._gfx.x = this.position.x;
        this._gfx.y = this.position.y;

         //As a small addition, flip the sprite to face the direction that the sheep is moving towards
        if((this._gfx.scale.x > 0 && this.position.x < this.destination.x) ||
            (this._gfx.scale.x < 0 && this.position.x > this.destination.x))
        {
            this._gfx.scale.x *= -1;
        }
    }

    public reachedDestination(): boolean 
    {
        return  Math.abs(this.position.x - this.destination.x) < this._reachThreshold && 
                Math.abs(this.position.y - this.destination.y) < this._reachThreshold;
    }

    public getGfx() { return this._gfx; }
    public isInYard() { return this.agentState == AgentState.InYard; }

    //Ai behavior responsible for the logic when the sheep is walking around it's initial area
    private aiPatrollingBehavior(deltaTime: number)
    {
        //Check to see if this sheep is close enough to start following the player, and that there aren't too many sheeps already doing so
        let distance = MathUtils.distanceTo(this.position, player.getPosition());
        if (Sheep._agentsFollowingPlayer < Sheep._maxAgentsFollowingPlayer && distance < this._aiFollowThreshold)
        {
            this.agentState = AgentState.FollowingPlayer;
            Sheep._agentsFollowingPlayer++;
        }
        else if(this.reachedDestination())
        {
            //In case we can't follow the player, calculate the wait time until when we should move to a new randomly picked location
            this._aiPatrollingConfig.waitTime -= deltaTime;
            if(this._aiPatrollingConfig.waitTime <= 0)
            {
                //If that time passed, then pick a new destination for the sheep
                this._aiPatrollingConfig.waitTime = this._aiPatrollingConfig.cooldown;

                let randomDestination = this.getPatrollingPosition();
                this.setDetination(randomDestination);
            }
        }
    }
    private getPatrollingPosition(): Vector2
    {
        //Pick a random position where the sheep should move to
        let randAngle = Math.random() * Math.PI * 2;
        let randRadius = (Math.random() - 0.5) * 2 * this._aiPatrollingConfig.patrollingRadius;

        let randomDestination: Vector2 = {
            x: this._initialPosition.x + Math.sin(randAngle) * randRadius,
            y: this._initialPosition.y + Math.cos(randAngle) * randRadius
        };

        //Check to see if the position is valid (doesn't intersect the yard, doesn't go outside the screen)
        if(MathUtils.rectContainsCircle(yardArea.getDimensions(), randomDestination, this._radius) ||
            MathUtils.pathIntersectsRectWithRadius(this.position, randomDestination, yardArea.getDimensions(), this._radius) ||
            randomDestination.x < 0 || randomDestination.x > window.innerWidth || randomDestination.y < 0 || randomDestination.y > window.innerHeight)
        {
            //If the position is invalid, call the function again, to pick a new position
            return this.getPatrollingPosition();
        }
        //If the position is valid, return it
        return randomDestination;
    }

    //Ai behavior responsible for following the player wherever it goes, while keeping a specific distance away from him
    private aiFollowingPlayerBehavior()
    {
        //Calculate the position where the sheep should go to
        let playerDir: Vector2 = MathUtils.normalize({
            x: player.getPosition().x - this.position.x,
            y: player.getPosition().y - this.position.y
        });
        let closestPoint: Vector2 = {
            x: player.getPosition().x - playerDir.x * this._aiFollowThreshold,
            y: player.getPosition().y - playerDir.y * this._aiFollowThreshold
        }
        this.setDetination(closestPoint);

        //If the sheep overlaps the yard
        if(MathUtils.rectContainsCircle(yardArea.getDimensions(), this.position, this._radius))
        {
            //Then add the sheep to the yard
            this.agentState = AgentState.InYard;
            let padding: number = 100;

            //Pick a random position in the yard, to move towards
            let randYardPos: Vector2 = {
                x: (yardArea.getDimensions().x + padding / 2) + Math.random() * (yardArea.getDimensions().width - padding),
                y: (yardArea.getDimensions().y + padding / 2) + Math.random() * (yardArea.getDimensions().height - padding)
            }
            this.setDetination(randYardPos);

            //Increment the ui counter, and reduce the number of sheeps following the player, to allow other sheeps to do so
            yardCounter.increment();
            Sheep._agentsFollowingPlayer--;
        }
    }
}