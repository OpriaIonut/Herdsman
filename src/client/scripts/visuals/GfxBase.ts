import { Graphics } from "pixi.js";
import { Vector2 } from "../../types";

export abstract class GfxBase
{
    protected _gfx: Graphics;

    constructor(zIndex: number)
    {
        this._gfx = new Graphics();
        this._gfx.zIndex = zIndex;
    }

    public abstract setColor(color: string): void;

    public getGfx() { return this._gfx; }

    public setPosition(pos: Vector2)
    {
        this._gfx.x = pos.x;
        this._gfx.y = pos.y;
    }
}