import { game } from "../client";
import { Rect, Vector2 } from "../types";
import { Sheep } from "./entities/Sheep";
import { MathUtils } from "./utils/MathUtils";

export class SheepSpawner
{
    private _invalidAreas: Rect[] = [];

    private _spawnedSheeps: Sheep[] = [];
    private _maxAnimals: number = 10;
    private _spawnInterval: number;

    constructor(maxAnimals: number, spawnInterval: number)
    {
        this._maxAnimals = maxAnimals;
        this._spawnInterval = spawnInterval * 1000;

        this.checkSpawnSheep();
    }

    public registerInvalidArea(area: Rect)
    {
        this._invalidAreas.push(area);
    }

    public checkSpawnSheep()
    {
        this.cleanList();
        if(this._spawnedSheeps.length < this._maxAnimals)
            this.spawnRandomSheep();

        setTimeout(() => { this.checkSpawnSheep(); }, this._spawnInterval);
    }
    
    private cleanList()
    {
        for(let index = 0; index < this._spawnedSheeps.length; ++index)
        {
            if(this._spawnedSheeps[index].isInYard() == true)
            {
                this._spawnedSheeps.splice(index, 1);
            }
        }
    }

    private spawnRandomSheep()
    {
        let randPos: Vector2 = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };
        const sheepRadius = 20;
        for(let index = 0; index < this._invalidAreas.length; ++index)
        {
            if(MathUtils.rectContainsCircle(this._invalidAreas[index], randPos, sheepRadius))
            {
                this.spawnRandomSheep();
                return;
            }
        }

        let sheep = new Sheep("#ffffff", randPos, sheepRadius, 500);
        game.addElement(sheep.getGfx());
        game.registerAgent(sheep);
        game.registerMover(sheep);
        this._spawnedSheeps.push(sheep);
    }
}