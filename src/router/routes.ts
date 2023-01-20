import { store } from "../store/Store";
import { RouteGuard, Router } from "./RouterFactory"
import { gotoParentPage } from "../utils/utils";


export type routeNames = 
    | '/'
    | '/404'
    | '/uploadedimages/:id?'
    | '/edit-document/:id?'
    | '/privatedocuments'
    | '/image/:id?'
    | '/user_manual'
    | '/collection_policy'
    | '/community_guidelines'
    | '/contact_us'
    | '/copyright_policy'
    | '/privacy_policy'
    | '/terms_of_use'
    | '/faq'
    
const routes:Record<routeNames, RouteGuard> = {
    '/' : null,
    '/404' : null,
    '/uploadedimages/:id?' : checkLoginStatus,
    '/edit-document/:id?' : checkLoginStatus,
    '/privatedocuments' : checkLoginStatus,
    "/image/:id?": checkLoginStatus,
    "/user_manual": null,
    "/collection_policy": null,
    "/community_guidelines": null,
    "/contact_us": null,
    "/copyright_policy": null,
    "/privacy_policy": null,
    "/terms_of_use": null,
    "/faq": null,
}

// async function fetchLogin() {
//     if (store.user) return;
//     await store.me()
//     return;
// }

async function checkLoginStatus() {
    if (store.user) {
        doubleCheck()
        return
    };
    await store.me()
    if (store.user) return;
    gotoParentPage('login', true)
    // TODO make redirect url configurable
    return {
        redirect:'',
        stall: true
    }
}

async function doubleCheck(){
    await store.me()
    if(!store.user){
        gotoParentPage('login', true)
    }
}

export const router = new Router(routes)
