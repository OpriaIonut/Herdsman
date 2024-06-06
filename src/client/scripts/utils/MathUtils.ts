import { Rect, Vector2 } from "../../types";

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

    static rectContainsPoint(rect: Rect, point: Vector2)
    {
        console.log(rect, point);
        return  point.x >= rect.x && 
                point.x <= rect.x + rect.width && 
                point.y >= rect.y && 
                point.y <= rect.y + rect.height;
    }

    static rectContainsCircle(rect: Rect, point: Vector2, radius: number)
    {
        const left = point.x - radius;
        const right = point.x + radius;
        const top = point.y - radius;
        const bottom = point.y + radius;

        return  right >= rect.x && 
                left <= rect.x + rect.width && 
                bottom >= rect.y && 
                top <= rect.y + rect.height;
    }

    static distanceTo(a: Vector2, b: Vector2)
    {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
}