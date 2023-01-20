import { DocumentCreateRequestBody, DocumentSaveRequestBody, State, StoreEvent, UploadInfo, User } from "./Store.types"
import { api as API } from "../webapi/api";
import { clone, objOverlay } from "../utils/utils";
import { messages } from "../consts/messages";
import { reduceDocumentResponse } from "../webapi/reducers";

const stateRecipe: State = {
    user: null,
    uploads: [],
    shoeBox: {
        content: [],
        empty: true,
        first: false,
        last: false,
        number: 0,
        size: 0,
        totalElements: 0,
        numberOfElements: 0,
        totalPages: 0,
    },
    shoeBoxSort: 'DESC&sortBy=DATE',
    documentPage: {
        content: [],
        empty: false,
        first: true,
        last: false,
        number: 0,
        numberOfElements: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0
    },
    documentsSort: 'DESC&sortBy=DATE',
    menuItemSize: {
        myShoeBoxSize: null,
        documentsSize: null
    },
}


export class Store extends EventTarget {

    api: typeof API

    private state: State

    get user() { return this.state.user }
    get uploads() { return this.state.uploads }
    get shoeBox() { return this.state.shoeBox }
    get shoeBoxSort() { return this.state.shoeBoxSort }
    get documentPage() { return this.state.documentPage }
    get documentsSort() { return this.state.documentsSort }
    get menuItemSize() { return this.state.menuItemSize }

    resetState() {
        objOverlay(this.state, stateRecipe)
    }

    async logout() {
        this.resetState()
        this.state.uploads = []
        return await this.api.logout()
    }
    async me() {
        const me = await this.api.me()
        this.state.user = me.error ? null : <User>me
        return this.state.user
    }

    async getMenuItemCount() {
        const menuresp = await this.api.getMenuItemCount();
        if(menuresp) {
            this.state.menuItemSize.myShoeBoxSize = menuresp.myShoeBoxSize as number | null;
            this.state.menuItemSize.documentsSize = menuresp.documentsSize  as number | null;
            this.sendEvent(StoreEvent.update, "menuItemSize")
        };
        return this.state.menuItemSize;
    }

    async uploadFiles(files: File[]) {
        const response = this.api.uploadFiles(files)
        this.state.uploads = this.state.uploads.concat(response)
        const uploadUpdateHandler = (e: Event) => {
            const error = (e.target as UploadInfo).error
            if (error) {
                if(error.code === 0){ // offline
                    error.message = messages.OFFLINE_ERROR
                    this.sendEvent(StoreEvent.serverError, {})
                }
            }
            this.dispatchEvent(new Event(StoreEvent.uploadsUpdate))
        }
        response.forEach(uploadInfo => uploadInfo.addEventListener('update', uploadUpdateHandler))
        return await response
    }

    clearUploads() {
        this.state.uploads = []
    }

    async loadShoeBox(sort: ("ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE") = 'DESC&sortBy=DATE', page = 0, size = 20) {
        this.state.shoeBoxSort = sort
        this.state.shoeBox.content = []
        const result = await this.api.shoeBox(sort, page, size)
        if (result.images) this.state.shoeBox = result.images
        return result
    }

    async deleteImages(imageIds: Array<number>){
        return await this.api.deleteImages(imageIds)
    }

    async getImage(id: string) {
        let imageData = await this.api.getImage(id);
        if(imageData) {
            imageData.modifiedAt = new Date(imageData.modifiedAt || "")
            imageData.uploadedAt = new Date(imageData.uploadedAt || "")
        }
        return imageData
    }

    async saveImageEdit(id: number, name: string, rotation: number) {
        return await this.api.saveImageEdit(id, name, rotation)
    }

    async saveDocument(body:DocumentSaveRequestBody){
        return this.api.saveDocument(body).then(d => {
            if(d.metaData){
                const data = reduceDocumentResponse(d)
                d.images = data.images
                d.metaData = data.metaData
            }
            return d
        })
    }

    async addImagesToDocument(body:DocumentCreateRequestBody){
        return this.api.addImagesToDocument(body)
    }

    async loadDocument(id:number){
        return this.api.loadDocument(id)
    }
    async loadDocuments(sort: ("ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE") = 'DESC&sortBy=DATE', page = 0, size = 20) {
        this.state.documentPage.content = []
        const result = await this.api.loadDocuments(sort, page, size);
        if(result && result.documentDataPage) {
            this.state.documentPage = result.documentDataPage;
        }
        return result;
    }

    async deleteDocument(id: number) {
        return await this.api.deleteDocument(id);
    }

    async publishDocument(id: string) {
        const result = await this.api.publishDocument(id);
        return result;
    }

    async generateOCR(id: number) {
        const result = await this.api.generateOCR(id);
        return result;
    }

    async autoSuggestTag(tag: string) {
        const result = await this.api.autoSuggestTag(tag);
        return result;
    }

    constructor(api: typeof API) {
        super()
        this.api = api
        api.addEventListener(StoreEvent.serverError, e => {
            const detail = (<CustomEvent>e).detail
            this.sendEvent(StoreEvent.serverError, detail)
        })
        this.state = new Proxy(clone(stateRecipe), {
            set: (target, key, value) => {
                this.sendEvent(StoreEvent.update, key)
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    value = new Proxy(value, {
                        set: (t, k, v) => {
                            this.sendEvent(StoreEvent.update, key) // maximum 2 depth reactivity
                            return Reflect.set(t, k, v)
                        }
                    })
                }
                return Reflect.set(target, key, value)
            }
        })
    }

    sendEvent(type: string, data: any) {
        this.dispatchEvent(new CustomEvent(type, { detail: data, bubbles: true, composed: true }))
    }
}


export const store = new Store(API)
export type Tstore = typeof store