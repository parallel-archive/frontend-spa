export type Params = {[key:string]:string}


export enum ErrorCode {
    Unauthorized = 401,
    NotFound = 404
}

export type ImageFit = 'original' | 'horizontal' | 'vertical' | 'x2'