import { Assets, Loader, Sprite, Text } from "pixi.js";
import { game } from "../../client";

export class YardCounter
{
    private _circle!: Sprite;
    private _counter: Text;

    private _count: number = 0;

    constructor()
    {
        this._counter = new Text();
        this._counter.setSize(36);
        this._counter.style.fill = "#ffffff";
        this._counter.text = "" + this._count;
        this._counter.zIndex = 10;

        this._counter.x = window.innerWidth / 2;
        this._counter.y = 50;
        this._counter.anchor.set(0.5);
        game.addElement(this._counter);
    }

    public async init()
    {
        let texture = await Assets.load("ui/EmptyCircle.png");

        this._circle = new Sprite();
        this._circle.texture = texture;
        this._circle.tint = "#b3862e";
        this._circle.zIndex = 10;

        this._circle.x = this._counter.x;
        this._circle.y = this._counter.y;
        this._circle.width = 75;
        this._circle.height = this._circle.width;
        this._circle.anchor.set(0.5);

        game.addElement(this._circle);
    }

    public increment()
    {
        this._count++;
        this._counter.text = "" + this._count;
    }
}