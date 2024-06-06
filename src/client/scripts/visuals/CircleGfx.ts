import { Vector2 } from "../../types";
import { GfxBase } from "./GfxBase";

//Utility class for drawing circles to the screen, which abstracts Pixi.js functionality
export class CircleGfx extends GfxBase
{
    private _radius: number;

    constructor(color: string, pos: Vector2, radius: number, zIndex: number)
    {
        super(zIndex);
        this._radius = radius;
        this._gfx.circle(0, 0, radius).fill({ color: color });
        this.setPosition(pos);
    }

    public setColor(color: string)
    {
        this._gfx.clear();
        this._gfx.circle(0, 0, this._radius).fill({ color: color });
    }
}