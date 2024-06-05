import { Vector2 } from "../../types";
import { MathUtils } from "../utils/MathUtils";
import { IMover } from "../interfaces/IMover";
import { CircleGfx } from "../visuals/CircleGfx";

export class Sheep implements IMover
{
    public position = { x: 0, y: 0 };
    public destination = { x: 0, y: 0 };
    public speed = 10;

    private _reachThreshold = 10.0;
    private _gfx: CircleGfx;

    constructor(bgColor: string, pos: Vector2, radius: number, speed: number)
    {
        this.position = pos;
        this.destination = this.position;
        this.speed = speed;

        this._gfx = new CircleGfx(bgColor, this.position, radius);
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
    public isInYard() { return false; }
}