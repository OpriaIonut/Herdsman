import { game } from "../client";
import { Rect, Vector2 } from "../types";
import { Sheep } from "./entities/Sheep";
import { MathUtils } from "./utils/MathUtils";

//Script responsible for spawning sheeps randomly on the map, at random time intervals
export class SheepSpawner
{
    private _invalidAreas: Rect[] = []; //Marked areas in which sheeps shouldn't spawn. In the case of this game, it's the yard.

    private _spawnedSheeps: Sheep[] = []; //List containing all of the sheeps spawned, which are not inside the yard yet
    private _maxAnimals: number = 10; //Maximum sheeps available on the map, which are not inside a yard
    private _spawnInterval: { min: number, max: number}; //Random time inverval between sheep spawns

    constructor(maxAnimals: number, spawnInterval: { min: number, max: number })
    {
        this._maxAnimals = maxAnimals;
        this._spawnInterval = spawnInterval;

        let nextSpawn = this._spawnInterval.min + Math.random() * (this._spawnInterval.max - this._spawnInterval.min);
        setTimeout(() => { this.checkSpawnSheep(); }, nextSpawn * 1000);
    }

    //Mark new areas as "invalid" for spawning the sheeps
    public registerInvalidArea(area: Rect)
    {
        this._invalidAreas.push(area);
    }

    public checkSpawnSheep()
    {
        //Check to see if we have any sheeps that moved inside the yard, since the last check, and if so, remove them from the list
        this.cleanList();

        //If we still haven't passed the limit for spawning the animals, then spawn a new sheep
        if(this._spawnedSheeps.length < this._maxAnimals)
            this.spawnRandomSheep();

        //Pick a random interval, and call this function again, to spawn more sheeps
        let nextSpawn = this._spawnInterval.min + Math.random() * (this._spawnInterval.max - this._spawnInterval.min);
        setTimeout(() => { this.checkSpawnSheep(); }, nextSpawn * 1000);
    }
    
    private cleanList()
    {
        //Go through each of the spawned sheeps, and in case any of them entered the yard, remove them from the list
        for(let index = 0; index < this._spawnedSheeps.length; ++index)
        {
            if(this._spawnedSheeps[index].isInYard() == true)
            {
                this._spawnedSheeps.splice(index, 1);
                index--;
            }
        }
    }

    private spawnRandomSheep()
    {
        //Pick a random position, where we will place the sheep
        let randPos: Vector2 = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };
        const sheepRadius = 25;

        //For the picked position, go through each of the invalid areas, and in case it overlaps, run the function again, to pick a new position
        for(let index = 0; index < this._invalidAreas.length; ++index)
        {
            if(MathUtils.rectContainsCircle(this._invalidAreas[index], randPos, sheepRadius))
            {
                this.spawnRandomSheep();
                return;
            }
        }

        //If we passed the check above, it means that the position is valid, in which case we want to spawn the sheep
        let sheep = new Sheep("#ffffff", randPos, sheepRadius, 500);
        game.addElement(sheep.getGfx());
        game.registerAgent(sheep);
        game.registerMover(sheep);
        this._spawnedSheeps.push(sheep);
    }
}