import { Graphics } from "pixi.js";
import { Rect, Vector2 } from "../../types";

export class RectangleGfx
{
    private _rect: Graphics;

    constructor(bgColor: string, dimensions: Rect)
    {
        this._rect = new Graphics();
        this._rect.rect(0, 0, dimensions.width, dimensions.height).fill({ color: bgColor });
        this.setPosition({ x: dimensions.x, y: dimensions.y });
    }

    public getGfx() { return this._rect; }

    public setPosition(pos: Vector2)
    {
        this._rect.x = pos.x;
        this._rect.y = pos.y;
    }

    public getDimensions(): Rect { 
        return { 
            x: this._rect.x, 
            y: this._rect.y,
            width: this._rect.width,
            height: this._rect.height
        };
    }
}