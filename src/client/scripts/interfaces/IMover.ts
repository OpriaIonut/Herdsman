import { Vector2 } from "../../types";

export interface IMover
{
    position: Vector2;
    destination: Vector2;
    speed: number;

    setDetination(pos: Vector2): void;
    move(deltaTime: number): void;
    reachedDestination(): boolean;
}