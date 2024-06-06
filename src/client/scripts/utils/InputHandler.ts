import { EventCallback } from "../../types";

//Class responsible for registering player input, which provides callbacks that other parts of the code can subscribe to
export class InputHandler
{
    private _onClickListeners: EventCallback[] = [];

    constructor()
    {
        window.addEventListener("click", (e) => { this.onClickHandler(e); });
    }

    public subscribeOnClick(callback: EventCallback): void 
    {
        this._onClickListeners.push(callback);
    }
    public unsubscribeOnClick(callback: EventCallback): void 
    {
        this._onClickListeners = this._onClickListeners.filter(listener => listener !== callback);
    }

    private onClickHandler(e: MouseEvent)
    {
        this._onClickListeners.forEach(listener => listener(e.clientX, e.clientY));
    }
}