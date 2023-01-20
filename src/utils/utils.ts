import { PARENT_SITE_URL } from "../cfg/cfg";

export function clone<T>(obj: T): T {
    return typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj
}

export function wait(delay = 200) {
    return new Promise(res => {
        setTimeout(res, delay);
    })
}


export function objToMap<T, F>(obj: { [key: string]: T }, fn: (key: string, value: T) => [string, F]) {
    return new Map(
        Object.entries(obj).map(([k, v]) => fn(k, v))
    )
}

export function objOverlay<T>(objA:T, objB:T){
    (Object.keys(objA) as (keyof T)[]).forEach(k => {
        objA[k] = objB[k]
    })
}

export function serverDateToDate(str:string){
    return new Date(str.replace('@', 'T').replace('.000+0000', 'Z'))
}

export async function emptyResolver() { return Promise.resolve() }

export function gotoParentPage(pathname:string, setTargetUrl=false){
    window.location.href = `${PARENT_SITE_URL}/${pathname}${setTargetUrl ? `?targetUrl=/app${window.location.pathname}` : ''}`;
}