import { Graphics } from "pixi.js";

export class RectangleGfx
{
    private _rect: Graphics;

    constructor(bgColor: string, x: number, y: number, width: number, height: number)
    {
        this._rect = new Graphics();
        this._rect.rect(x, y, width, height).fill({ color: bgColor });
    }

    public getGfx() { return this._rect; }

    public setPosition(x: number, y: number)
    {
        this._rect.x = x;
        this._rect.y = y;
    }
}