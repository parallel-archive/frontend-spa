import { match } from "path-to-regexp";
import { Params } from "../main.types";
import { emptyResolver, objToMap } from "../utils/utils";


export type Redirect = {redirect:string, stall?:boolean}
export type RouteGuard = ((routeParams:Params) => Promise<void | Redirect>) | null


interface RouteElement extends HTMLElement {
    route: { path: string, params: Params }
}

export class Router {

    private routes
    element?: RouteElement

    constructor(routeDefinitions: { [key: string]: RouteGuard }) {
        this.routes = objToMap(routeDefinitions, (path, routeGuard) => ([path, {
            path,
            routeGuard: routeGuard,
            match: match(path, { decode: decodeURIComponent }),
        }]))
    }

    attach(element: RouteElement) {
        if (this.element) return
        this.element = element
        
        this.update(window.location.pathname, false);
        
        window.addEventListener('popstate',
        () => this.update(window.location.pathname, false))
        
        element.addEventListener('click', e => {
            if(e.defaultPrevented) return
            let element = (e.composedPath() as HTMLAnchorElement[]).find(el => el.tagName === 'A' && !!el.href)
            if (element) {
                this.update(element.getAttribute('href')!)
                e.preventDefault()
            }
        })
        element.addEventListener('router:goto', e => {
            const path:string = (<CustomEvent>e).detail
            this.update(path)
        })
        return this
    }

    private txId = 0
    private async resolve(path: string) {
        const txId = ++this.txId
        for (const [_, route] of this.routes) {
            const matched = route.match(path)
            if(!matched) continue
            const params = matched.params as Params
            const routeGuard = route.routeGuard || emptyResolver
            const guardResult = await routeGuard(params)
            if(txId !== this.txId) return // this is an old one returning late
            if(guardResult 
                && guardResult.redirect 
                && guardResult.redirect !== path) {
                    this.update(guardResult.redirect, true) 
                    return // return undefined to not process this pass as 404
            }
            if(guardResult && guardResult.stall) return;
            return {
                path: route.path,
                params
            }
        }
        return null // null to indicate none of the routes match
    }

    private previousPath = '$'
    private async update(path: string, addToHistory = true) {
        if (path === this.previousPath) return
        this.previousPath = path
        const match = await this.resolve(path)
        if (match) {
            if (addToHistory && history.state?.path !== path) {
                history.pushState({ path }, '', path)
            }
            if (this.element) this.element.route = match
        } else if(match === null){
            this.update('/404', true) // todo implement 404 redirect
        }
        document.body.removeAttribute('data-overlay-open')
    }
}
