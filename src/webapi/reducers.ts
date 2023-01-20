import { ShoeBoxPageData, DocumentPageData, DocumentData } from "../store/Store.types"
import { serverDateToDate } from "../utils/utils"

export function reduceShoeBoxResponse(pageData: ShoeBoxPageData) {
    {
        let {
            content,
            empty,
            first,
            last,
            number,
            numberOfElements,
            size,
            totalElements,
            totalPages
        } = pageData



        content = content.map(c => {
            c.modifiedAt = serverDateToDate(String(c.modifiedAt))
            c.uploadedAt = serverDateToDate(String(c.uploadedAt))
            return c
        })


        return {
            content,
            empty,
            first,
            last,
            number,
            numberOfElements,
            size,
            totalElements,
            totalPages
        }
    }
}

export function reduceDocumentResponse(d: any): DocumentData { // TODO no any
    d.metaData.createdAtYear = d.metaData.createdAtYear || undefined
    d.metaData.periodCoveredFrom = d.metaData.periodCoveredFrom || undefined
    d.metaData.periodCoveredTo = d.metaData.periodCoveredTo || undefined
    return {
        metaData:d.metaData,
        images: d.images.map((image:any) => {
            image.uploadedAt = serverDateToDate(image.uploadedAt)
            return image
        })
    }
}
export function reduceDocumentPageResponse(pageData: DocumentPageData) {
    {
        let {
            content,
            empty,
            first,
            last,
            number,
            numberOfElements,
            size,
            totalElements,
            totalPages
        } = pageData

        content = content.map((c:any) => {
            c.modifiedAt = serverDateToDate(String(c.modifiedAt))
            c.uploadedAt = serverDateToDate(String(c.uploadedAt))
            return c
        })

        return {
            content,
            empty,
            first,
            last,
            number,
            numberOfElements,
            size,
            totalElements,
            totalPages
        }
    }
}