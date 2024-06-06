import { Vector2 } from "../../types";

//Base interface for defining the move behavior for the objects in the game
export interface IMover
{
    position: Vector2;
    destination: Vector2;
    speed: number;

    setDetination(pos: Vector2): void;
    move(deltaTime: number): void;
    reachedDestination(): boolean;
}