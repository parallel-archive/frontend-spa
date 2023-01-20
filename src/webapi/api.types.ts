export type APIResponse<T> = Promise<Partial<T & {
    error: { message: string, code: string }
}>>

export type ResultCodeResponse = {
    resultCode:string
}