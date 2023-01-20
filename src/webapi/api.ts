import { API_ROOT } from "../cfg/cfg";
import { messages } from "../consts/messages";
import { Params } from "../main.types";
import { ShoeBoxPageData, StoreEvent, User, ShoeBoxImage, DocumentSaveRequestBody, DocumentData, DocumentPageData, DocumentCreateRequestBody, PublishedDocumentData, AutoSuggestList } from "../store/Store.types";
import { gotoParentPage } from "../utils/utils";
import type { APIResponse, ResultCodeResponse } from "./api.types";
import { FileUploadApi } from "./FileUploadApi";
import { reduceDocumentResponse,reduceDocumentPageResponse, reduceShoeBoxResponse } from "./reducers";

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'


class Api extends EventTarget {

    logout() {
        return this.post('/logout', null).then(() => true).catch(() => false)
    }

    me(): APIResponse<User> {
        return this.get('/user/active')
    }

    getMenuItemCount(): APIResponse<{myShoeBoxSize: null | number, documentsSize: null | number}> {
        return this.get('/user/menu')
    }

    uploadFiles = FileUploadApi.uploadFiles.bind(this)

    shoeBox(sort: ("ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE") = 'DESC&sortBy=DATE', page: number, size: number): APIResponse<{ images: ShoeBoxPageData }> {
        return this.get(`/user/myshoebox?sort=${sort}&page=${page}&size=${size}`).then(d => {
            if (d.images) d.images = reduceShoeBoxResponse(d.images as ShoeBoxPageData)
            return d
        })
    }

    deleteImages(imageIds: Array<number>): APIResponse<ResultCodeResponse> {
        return this.delete("/images/delete", { imageIds })
    }

    getImage(id: string): APIResponse<ShoeBoxImage> {
        return this.get(`/image/${id}`)
    }

    saveImageEdit(id: number, name: string, rotation: number): APIResponse<{ image: ShoeBoxImage }> {
        return this.put(`/image/${id}`, { id, name, rotation })
    }
    saveDocument(body: DocumentSaveRequestBody):APIResponse<DocumentData> {
        return this.put(`/document/${body.id}`, body)
    }
    addImagesToDocument(body: DocumentCreateRequestBody):APIResponse<DocumentData> {
        return this.post('/document/images', body).then(d => {
            if(d.metaData){
                const data = reduceDocumentResponse(d);
                d.images = data.images;
                d.metaData = data.metaData;
            }
            return d;
        });
    }
    loadDocument(id:number):APIResponse<DocumentData>{
        return this.get(`/document/${id}`).then(d => {
            if(d.metaData){
                const data = reduceDocumentResponse(d)
                d.images = data.images
                d.metaData = data.metaData
            }
            return d
        })
    }

    loadDocuments(sort: "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE" = 'DESC&sortBy=DATE', page: number, size: number): APIResponse<{documentDataPage: DocumentPageData}> {
        return this.get(`/documents?sort=${sort}&page=${page}&size=${size}`).then(d => {
            if(d?.documentDataPage) {
                d.documentDataPage = reduceDocumentPageResponse(d.documentDataPage as DocumentPageData)
            }
            return d;
        });
    }

    deleteDocument(id: number): APIResponse<ResultCodeResponse> {
        return this.delete(`/document/${id}`, {});
    }

    publishDocument(id: string): APIResponse<PublishedDocumentData> {
        return this.post(`/document/${id}`, {});
    }

    generateOCR(id: number): APIResponse<DocumentData> {
        return this.post(`/document/${id}/ocr`, {}).then(d => {
            if(d.metaData){
                const data = reduceDocumentResponse(d);
                d.images = data.images;
                d.metaData = data.metaData;
            }
            return d;
        });
    }

    async autoSuggestTag(tag: string): APIResponse<AutoSuggestList>  {
        return this.get(`/search/tag/${tag}`, {});
    }

    private get(path: string, queryStringParams?: Params) {
        return this.request('GET', path, queryStringParams)
    }

    private post(path: string, body: Object | null, queryStringParams?: Params) {
        return this.request('POST', path, queryStringParams, body)
    }

    private put(path: string, body: Object, queryStringParams?: Params) {
        return this.request('PUT', path, queryStringParams, body)
    }

    private delete(path: string, body: Object, queryStringParams?: Params) {
        return this.request('DELETE', path, queryStringParams, body)
    }

    protected sendFatalEvent(detail: any) {
        this.dispatchEvent(new CustomEvent(StoreEvent.serverError, { detail, bubbles: true, composed: true }))
    }

    protected crunchErrors(error: any, errors: any): null | { message?: string, code?: number } { //fuckit
        if (error) {
            if (typeof error === 'string') return { message: error }
        }
        if (!(typeof errors === 'object')) return null
        errors = Array.isArray(errors) ? errors[0] : errors
        errors.message = errors.general || errors.message || errors.defaultMessage || messages.UNKNOWN_ERROR
        errors.code = errors.code || errors.resultCode || ''
        return errors

    }

    private request(method: Methods, path: string, queryStringParams?: Params, body?: Object | null): APIResponse<any> {
        return fetch(`${API_ROOT}${path}${this.paramsToQueryString(queryStringParams || {})}`,
            {
                method,
                headers: body ? { 'Content-Type': 'application/json' } : {},
                ...(body ? { body: JSON.stringify(body) } : {})
            })
            .then(async response => {
                if(response.status === 401){
                    gotoParentPage('login', true)
                    return
                }
                let result = {} as any
                try {
                    result = await response.json()
                    if (typeof result !== 'object') result = { message: result }
                    result.error = this.crunchErrors(result.error, result.errors) // every error response from the backend is formatted differently. thanks.
                } catch (e) { console.error(e) }
                if (response.status >= 400) this.sendFatalEvent(Object.assign({ status: response.status }, result))
                return result
            })
            .catch(() => {
                this.sendFatalEvent({ status: -1 })
                return { error: { message: messages.OFFLINE_ERROR } }
            })
    }

    private paramsToQueryString(params: Params): string {
        const entries = Object.entries(params)
        if (!entries.length) return ''
        return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    }
}

export type ApiType = InstanceType<typeof Api>
export const api = new Api()
