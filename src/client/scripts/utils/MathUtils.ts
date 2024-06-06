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

    static pathIntersectsRect(pointA: Vector2, pointB: Vector2, rect: Rect)
    {
        let lineMinX = Math.min(pointA.x, pointB.x);
        let lineMaxX = Math.max(pointA.x, pointB.x);
        let lineMinY = Math.min(pointA.y, pointB.y);
        let lineMaxY = Math.max(pointA.y, pointB.y);

        let rectMinX = rect.x;
        let rectMaxX = rect.x + rect.width;
        let rectMinY = rect.y;
        let rectMaxY = rect.y + rect.height;

        return !(lineMaxX < rectMinX || lineMinX > rectMaxX || lineMaxY < rectMinY || lineMinY > rectMaxY);
    }

    static pathIntersectsRectWithRadius(pointA: Vector2, pointB: Vector2, rect: Rect, radius: number)
    {
        let inflatedRect = {
            x: rect.x - radius,
            y: rect.y - radius,
            width: rect.width + 2 * radius,
            height: rect.height + 2 * radius
        };

        let lineMinX = Math.min(pointA.x, pointB.x);
        let lineMaxX = Math.max(pointA.x, pointB.x);
        let lineMinY = Math.min(pointA.y, pointB.y);
        let lineMaxY = Math.max(pointA.y, pointB.y);

        let rectMinX = inflatedRect.x;
        let rectMaxX = inflatedRect.x + inflatedRect.width;
        let rectMinY = inflatedRect.y;
        let rectMaxY = inflatedRect.y + inflatedRect.height;

        return !(lineMaxX < rectMinX || lineMinX > rectMaxX || lineMaxY < rectMinY || lineMinY > rectMaxY);
    }

    static distanceTo(a: Vector2, b: Vector2)
    {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
}