import { Graphics } from "pixi.js";
import { Vector2 } from "../../types";

export class CircleGfx
{
    private _circle: Graphics;

    constructor(bgColor: string, pos: Vector2, radius: number)
    {
        this._circle = new Graphics();
        this._circle.circle(0, 0, radius).fill({ color: bgColor });
        this.setPosition(pos);
    }

    public getGfx() { return this._circle; }

    public setPosition(pos: Vector2)
    {
        this._circle.x = pos.x;
        this._circle.y = pos.y;
    }
}