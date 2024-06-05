import { Graphics } from "pixi.js";
import { Vector2 } from "../../types";

export class RectangleGfx
{
    private _rect: Graphics;

    constructor(bgColor: string, pos: Vector2, width: number, height: number)
    {
        this._rect = new Graphics();
        this._rect.rect(pos.x, pos.y, width, height).fill({ color: bgColor });
    }

    public getGfx() { return this._rect; }

    public setPosition(pos: Vector2)
    {
        this._rect.x = pos.x;
        this._rect.y = pos.y;
    }
}