import { Vector2 } from "../../types";
import { MathUtils } from "../utils/MathUtils";
import { IMover } from "../interfaces/IMover";
import { CircleGfx } from "../visuals/CircleGfx";
import { AgentState, IAgentBehavior } from "../interfaces/IAgentBehavior";
import { player, yardArea, yardCounter } from "../../client";
import { Assets, Sprite, Texture } from "pixi.js";

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

    private _aiPatrollingConfig = {
        cooldown: 3,
        waitTime: 3,
        patrollingRadius: 400
    }
    private _aiFollowThreshold: number = 100;

    private static _agentsFollowingPlayer: number = 0;
    private static _maxAgentsFollowingPlayer: number = 5;
    private static sheepTexture?: Texture;

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
        if(Sheep.sheepTexture == undefined)
            Sheep.sheepTexture = await Assets.load("ui/Sheep.png");
        this._gfx.texture = Sheep.sheepTexture as Texture;
        this._gfx.zIndex = 1;
        this._gfx.position.x = this.position.x;
        this._gfx.position.y = this.position.y;
        this._gfx.width = this._radius * 3;
        this._gfx.height = this._radius * 3;
        this._gfx.anchor.set(0.5);
    }

    public updateAgent(deltaTime: number): void 
    {
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
        let moveDir = {
            x: this.destination.x - this.position.x,
            y: this.destination.y - this.position.y
        };
        moveDir = MathUtils.normalize(moveDir);

        this.position.x += moveDir.x * this.speed * deltaTime;
        this.position.y += moveDir.y * this.speed * deltaTime;
        
        if((this._gfx.scale.x > 0 && this.position.x < this.destination.x) ||
            (this._gfx.scale.x < 0 && this.position.x > this.destination.x))
        {
            this._gfx.scale.x *= -1;
        }

        this._gfx.x = this.position.x;
        this._gfx.y = this.position.y;
    }

    public reachedDestination(): boolean 
    {
        return  Math.abs(this.position.x - this.destination.x) < this._reachThreshold && 
                Math.abs(this.position.y - this.destination.y) < this._reachThreshold;
    }

    public getGfx() { return this._gfx; }
    public isInYard() { return this.agentState == AgentState.InYard; }

    private aiPatrollingBehavior(deltaTime: number)
    {
        if(Sheep._agentsFollowingPlayer >= Sheep._maxAgentsFollowingPlayer)
            return;

        let distance = MathUtils.distanceTo(this.position, player.getPosition());
        if (distance < this._aiFollowThreshold)
        {
            this.agentState = AgentState.FollowingPlayer;
            Sheep._agentsFollowingPlayer++;
        }
        else if(this.reachedDestination())
        {
            this._aiPatrollingConfig.waitTime -= deltaTime;
            if(this._aiPatrollingConfig.waitTime <= 0)
            {
                this._aiPatrollingConfig.waitTime = this._aiPatrollingConfig.cooldown;

                let randomDestination = this.getPatrollingPosition();
                this.setDetination(randomDestination);
            }
        }
    }

    private getPatrollingPosition(): Vector2
    {
        let randAngle = Math.random() * Math.PI * 2;
        let randRadius = (Math.random() - 0.5) * 2 * this._aiPatrollingConfig.patrollingRadius;

        let randomDestination: Vector2 = {
            x: this._initialPosition.x + Math.sin(randAngle) * randRadius,
            y: this._initialPosition.y + Math.cos(randAngle) * randRadius
        };
        if(MathUtils.rectContainsCircle(yardArea.getDimensions(), randomDestination, this._radius) ||
            MathUtils.pathIntersectsRectWithRadius(this.position, randomDestination, yardArea.getDimensions(), this._radius) ||
            randomDestination.x < 0 || randomDestination.x > window.innerWidth || randomDestination.y < 0 || randomDestination.y > window.innerHeight)
        {
            return this.getPatrollingPosition();
        }
        return randomDestination;
    }

    private aiFollowingPlayerBehavior()
    {
        let playerDir: Vector2 = MathUtils.normalize({
            x: player.getPosition().x - this.position.x,
            y: player.getPosition().y - this.position.y
        });
        let closestPoint: Vector2 = {
            x: player.getPosition().x - playerDir.x * this._aiFollowThreshold,
            y: player.getPosition().y - playerDir.y * this._aiFollowThreshold
        }
        this.setDetination(closestPoint);

        if(MathUtils.rectContainsCircle(yardArea.getDimensions(), this.position, this._radius))
        {
            this.agentState = AgentState.InYard;
            let padding: number = 100;

            let randYardPos: Vector2 = {
                x: (yardArea.getDimensions().x + padding / 2) + Math.random() * (yardArea.getDimensions().width - padding),
                y: (yardArea.getDimensions().y + padding / 2) + Math.random() * (yardArea.getDimensions().height - padding)
            }
            this.setDetination(randYardPos);

            yardCounter.increment();
            Sheep._agentsFollowingPlayer--;
        }
    }
}