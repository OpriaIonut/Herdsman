import { Graphics } from "pixi.js";
import { Rect, Vector2 } from "../../types";
import { GfxBase } from "./GfxBase";

export class RectangleGfx extends GfxBase
{
    private _dimensions: Rect;

    constructor(color: string, dimensions: Rect, zIndex: number)
    {
        super(zIndex);
        this._dimensions = dimensions;
        this._gfx.rect(0, 0, dimensions.width, dimensions.height).fill({ color: color });
        this.setPosition({ x: dimensions.x, y: dimensions.y });
    }

    public setColor(color: string): void 
    {
        this._gfx.clear();
        this._gfx.rect(0, 0, this._dimensions.width, this._dimensions.height).fill({ color: color });
    }

    public getDimensions(): Rect { 
        return { 
            x: this._gfx.x, 
            y: this._gfx.y,
            width: this._gfx.width,
            height: this._gfx.height
        };
    }
}