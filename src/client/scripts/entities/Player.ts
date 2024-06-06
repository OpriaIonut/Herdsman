import { Vector2 } from "../../types";
import { MathUtils } from "../utils/MathUtils";
import { IMover } from "../interfaces/IMover";
import { CircleGfx } from "../visuals/CircleGfx";
import { Assets, Sprite } from "pixi.js";

//Class which describes the visuals for the player
export class Player implements IMover
{
    public position = { x: 0, y: 0 };
    public destination = { x: 0, y: 0 };
    public speed = 10;

    private _radius: number;
    private _reachThreshold = 10.0;
    private _gfx: Sprite;

    constructor(bgColor: string, pos: Vector2, radius: number, speed: number)
    {
        this.position = pos;
        this.destination = this.position;
        this.speed = speed;
        this._radius = radius;

        //this._gfx = new CircleGfx(bgColor, this.position, radius, 2);
        this._gfx = new Sprite();
        this.loadSprite();
    }

    private async loadSprite()
    {
        //Load and initialize a sprite for the player
        let texture = await Assets.load("ui/Player.png");
        this._gfx.texture = texture;
        this._gfx.zIndex = 2;
        this._gfx.position.x = this.position.x;
        this._gfx.position.y = this.position.y;
        this._gfx.width = this._radius * 3;
        this._gfx.height = this._radius * 3;
        this._gfx.anchor.set(0.5);
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

        //Move the object in the set direction while taking into account the speed of the player
        this.position.x += moveDir.x * this.speed * deltaTime;
        this.position.y += moveDir.y * this.speed * deltaTime;
        
        //As a small addition, flip the sprite to face the direction that the player is moving towards
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

    public getRadius() { return this._radius; }
    public getPosition() { return this.position; }
    public getGfx() { return this._gfx; }
}