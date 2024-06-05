import { EventCallback } from "../../types";

export class InputHandler
{
    private listeners: EventCallback[] = [];

    constructor()
    {
        window.addEventListener("click", (e) => { this._onClickHandler(e); });
    }

    public subscribeOnClick(callback: EventCallback): void 
    {
        this.listeners.push(callback);
    }
    public unsubscribeOnClick(callback: EventCallback): void 
    {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    private _onClickHandler(e: MouseEvent)
    {
        this.listeners.forEach(listener => listener(e.clientX, e.clientY));
    }
}