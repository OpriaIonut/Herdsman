import { Vector2 } from "../../types";
import { MathUtils } from "../utils/MathUtils";
import { IMover } from "../interfaces/IMover";
import { CircleGfx } from "../visuals/CircleGfx";
import { AgentState, IAgentBehavior } from "../interfaces/IAgentBehavior";
import { player, yardArea } from "../../client";

export class Sheep implements IMover, IAgentBehavior
{
    public position = { x: 0, y: 0 };
    public destination = { x: 0, y: 0 };
    public speed = 10;
    public agentState: AgentState = AgentState.Patrolling;

    private _reachThreshold = 10.0;
    private _radius: number;
    private _gfx: CircleGfx;

    private _aiFollowThreshold: number = 100;

    private static _agentsFollowingPlayer: number = 0;
    private static _maxAgentsFollowingPlayer: number = 5;

    constructor(bgColor: string, pos: Vector2, radius: number, speed: number)
    {
        this.position = pos;
        this.destination = this.position;
        this.speed = speed;
        this._radius = radius;

        this._gfx = new CircleGfx(bgColor, this.position, radius);
    }
    
    public updateAgent(deltaTime: number): void 
    {
        switch(this.agentState)
        {
            case AgentState.Patrolling:
                this.aiPatrollingBehavior();
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
        
        this._gfx.setPosition(this.position);
    }

    public reachedDestination(): boolean 
    {
        return  Math.abs(this.position.x - this.destination.x) < this._reachThreshold && 
                Math.abs(this.position.y - this.destination.y) < this._reachThreshold;
    }

    public getGfx() { return this._gfx.getGfx(); }
    public isInYard() { return this.agentState == AgentState.InYard; }

    private aiPatrollingBehavior()
    {
        if(Sheep._agentsFollowingPlayer >= Sheep._maxAgentsFollowingPlayer)
            return;

        let distance = MathUtils.distanceTo(this.position, player.getPosition());
        if (distance < this._aiFollowThreshold)
        {
            this.agentState = AgentState.FollowingPlayer;
            Sheep._agentsFollowingPlayer++;
        }
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

            Sheep._agentsFollowingPlayer--;
        }
    }
}