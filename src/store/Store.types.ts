export type User = {
    name: string
} | null

export type Scope = 'INFO' | 'WARNING' | 'ERROR'

export type FileUploadedMeta = {
    id: number,
    messages: {
        id: string,
        message: string,
        scope: Scope
    }[],
    myShoeBoxId: number,
    thumbnailUrl: string,
    uploadedAt: string,
    url: string
}

export type UploadInfo = EventTarget & {
    file: File
    uploadMeta: FileUploadedMeta | null
    percent: number
    success: boolean
    error: {
        code: number
        message: string
    } | null
    done: boolean
}

export type ShoeBoxImage = {

    activeThumbnailUrl: string,
    activeUrl: string,
    error: {
        code: number
        message: string
    } | null
    id: number,
    messages: [],
    modifiedAt: Date,
    name: string,
    rotation: number,
    thumbnailUrl: string,
    uploadedAt: Date,
    url: string,
    ocr?: string | null

}

export type DocumentImage = Pick<ShoeBoxImage,
|"id"
|"name"
|"url"
|"thumbnailUrl"
|"uploadedAt"
|"ocr"
>

export type ShoeBoxPageData = {
    content: ShoeBoxImage[]
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number,
    size: number,
    totalElements: number,
    numberOfElements: number,
    totalPages: number,
}

export type State = {
    user: User,
    uploads: UploadInfo[],
    shoeBox: ShoeBoxPageData,
    shoeBoxSort: "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE",
    documentPage: DocumentPageData,
    documentsSort: "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE",
    menuItemSize: MenuItemSize,
}

export enum StoreEvent {
    update = 'store.update',
    uploadsUpdate = 'store.uploadsupdate',
    serverError = 'store.serverError',
}

export type DocumentGetRequestMeta = Partial<{
    archiveCategory: string,
    archiveName: string,
    catalogUrl: string,
    referenceCode: string,
    countriesCovered: {
        filters:{
            active: boolean,
            id: number,
            name: {
                displayName: string,
                name: string
            }
        }[]
    },
    createdAtYear: number,
    languages: {
        filters:{
            active: boolean,
            id: number,
            name: {
                displayName: string,
                name: string
            }
        }[]
    },
    originalTitle: string,
    originalAuthor: string,
    periodCoveredFrom: number,
    periodCoveredTo: number,
    publication: string,
    sourceUrl: string,
    types: {
        filters:{
            active: boolean,
            id: number,
            name: {
                displayName: string,
                name: string
            }
        }[]
    },
    tags: string[]
}>

export type DocumentSaveRequestMeta = Partial<{
    archiveCategory: string,
    archiveName: string,
    catalogUrl: string,
    referenceCode: string,
    countriesCovered: number[],
    createdAtYear: number,
    languages: number[],
    originalTitle: string,
    periodCoveredFrom: number,
    periodCoveredTo: number,
    publication: string,
    sourceUrl: string,
    types: number[],
    tags: string[]
}>

export type DocumentCreateRequestBody = {
    id?: number,
    imageIds: number[]
}

export type DocumentSaveRequestBody = {
    id?: number,
    images: {
        imageId: number,
        index: number
    }[]
    metaDataRequest?: DocumentSaveRequestMeta
}

export type DocumentData = {
    id?:number,
    images: DocumentImage[],
    metaData: DocumentGetRequestMeta,
    modifiedAt?: Date
    uploadedAt?: Date,
    messages?: [
        {
            id?: string,
            message?: string,
            responseMessageScope?: string
        }
    ]
}

export type DocumentPageData = {
    content: DocumentData[] | [],
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number,
    numberOfElements: number,
    size: number,
    totalElements: number,
    totalPages: number
}

export type PublishedDocumentData = {
    createdAt: "yyyy-MM-dd@HH:mm:ss.SSSZ",
    messages: {
        id: string,
        message: string,
        responseMessageScope: Scope
    }[],
    metaDataRequest: DocumentSaveRequestMeta,
    result: string,
    userName: string
}

export type AutoSuggestList = {
    tags: string[]
}

export type MenuItemSize = {
    myShoeBoxSize: null | number,
    documentsSize: null | number
}
