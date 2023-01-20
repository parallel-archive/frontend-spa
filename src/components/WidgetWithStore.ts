import type { AppRoot } from "./AppRoot";
import type { Tstore } from "../store/Store";
import { Widget } from "./Widget";
import { StoreEvent } from "../store/Store.types";

export class WidgetWithStore extends Widget {

    store: Tstore

    private _subs

    private updateOnStoreUpdate = (e: CustomEvent) => {
        if (this._subs.has(e.detail)) this.requestUpdate()
    }

    disconnectedCallback() {
        if (this.store) {
            this.store.removeEventListener(StoreEvent.update, this.updateOnStoreUpdate as EventListener)
        }
    }

    constructor() {
        super()
        this._subs = new Set()
        const root = document.body.querySelector('app-root')
        if (root) {
            this.store = new Proxy((<AppRoot>root).store!, {
                get: (target, key) => {
                    const result = Reflect.get(target, key)
                    if (typeof result === 'function') return result.bind(target)
                    this._subs.add(key)
                    return result
                }
            })
            this.store.addEventListener(StoreEvent.update, this.updateOnStoreUpdate as EventListener)
        } else {
            throw new Error("No root element found!");
        }
    }
}