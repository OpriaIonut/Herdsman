import { Vector2 } from "../../types";

export class MathUtils
{
    static normalize(vector: Vector2): Vector2
    {
        const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (length !== 0) {
            vector.x /= length;
            vector.y /= length;
        }
        return vector;
    }
}