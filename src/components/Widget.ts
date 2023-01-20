import { LitElement } from 'lit';

export class Widget extends LitElement {

    // get route() {
    //     return {
    //         goto(path: string) { 
    //             // history.pushState({ path }, '', path) 
    //             this.dispatchEvent
    //             window.dispatchEvent(new Event('popstate'))
    //         }
    //     }
    // }
    sendEvent(type:string, data:any){
        this.dispatchEvent(new CustomEvent(type,{detail:data, bubbles:true, composed:true}))
    }
    gotoRoute(path:string){
        this.sendEvent('router:goto', path)
    }

}