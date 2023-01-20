// global heic2any

import { API_ROOT, MAX_UPLOAD_SIZE_BYTES } from "../cfg/cfg"
import { messages } from "../consts/messages"
import type { UploadInfo } from "../store/Store.types"
import type { ApiType } from "./api"

function uploadFiles(this: ApiType, files: File[]): UploadInfo[] {

    return files.map(file => {
        const result: UploadInfo = Object.assign(new EventTarget(), {
            file,
            uploadMeta:null,
            percent: 0,
            success: false,
            error: null,
            done: false,
        })

        if(file.size > MAX_UPLOAD_SIZE_BYTES){
            result.percent = 100
            result.error = {
                code:413,
                message:messages.MEDIA_TOO_LARGE
            }
            result.done = true
            requestAnimationFrame(()=>{
                result.dispatchEvent(new Event('update'))
            })
            return result
        }

        const statusHandle = () => {
            let body:any = {}
            try {body = JSON.parse(ajax.responseText)}catch(e){}
            switch (ajax.status){
                case 200:
                    result.success = true
                    result.uploadMeta = JSON.parse(ajax.responseText)
                    break;
                case 401:
                    this.sendFatalEvent({ status: ajax.status, message: messages.UNAUTHORIZED_ERROR })
                    result.error = {
                        code:ajax.status,
                        message: messages.UNAUTHORIZED_ERROR
                    }
                    break;
                case 413:
                    result.error = {
                        code:ajax.status,
                        message:messages.MEDIA_TOO_LARGE
                    }
                    break;
                default:
                    result.error = {
                        code: ajax.status,
                        message: this.crunchErrors(body.error, body.errors)?.message ?? ''
                    }
                    break;
            }
            result.done = true
            result.dispatchEvent(new Event('update'))
            removeListeners()
        }

        const progressHandle = (e: ProgressEvent) => {
            result.percent = Math.round(e.loaded / e.total * 100)
            result.dispatchEvent(new Event('update'))
        }



        const removeListeners = () => {
            ajax.removeEventListener('load', statusHandle)
            ajax.removeEventListener('error', statusHandle)
            ajax.upload.removeEventListener('progress', progressHandle)
        }

        const formData = new FormData();
        const ajax = new XMLHttpRequest();
        (async () => {
            // const extension = file.name.split('.').pop() || ''

            // if(['heic', 'heif'].includes(extension)){
            //     await installHeic2Any()
            //     const heic2any = (window as any).heic2any
            //     const blob = await heic2any({blob:file})
            //     let name = file.name.split('.')
            //     name = name.slice(0,name.length - 1)
            //     file = new File([blob], name.join('.') + '.png', {type:'image/png'});
            //     // let cica = await blob.arrayBuffer();
            // }
            // convert heic here
            formData.append('file', file, file.name)
            ajax.addEventListener('load', statusHandle)
            ajax.addEventListener('error', statusHandle)
            ajax.upload.addEventListener('progress', progressHandle)
            ajax.open('POST', `${API_ROOT}/media`)
            ajax.send(formData)
        })();


        return result
    })
}

export const FileUploadApi = {
    uploadFiles
} as const