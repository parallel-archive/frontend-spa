import { html, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { StoreEvent } from '../store/Store.types';
import { WidgetWithStore } from './WidgetWithStore';
import { buttonsCss } from "./css/buttons.css";
import { generalCss } from "./css/general.css";

@customElement('file-upload')
export class FileUpload extends WidgetWithStore {

    @state()
    modalOpen = false

    @state()
    snackbarOpen = false

    @state()
    uploadedFiles = 0

    @state()
    numberOfFiles = 0

    @state()
    failedUploads = 0

    @state()
    heic2any: any
    
    @query('input[type="file"]')
    private _fileInput?: HTMLInputElement

    constructor() {
        super();
        this.store.addEventListener(StoreEvent.uploadsUpdate, this.updateOnUploadStatus)
    }

    async open(){
        await this.installHeic2Any()
        this.heic2any = (window as any).heic2any
        this._fileInput?.click()
    }

    installHeic2Any(){
        const installed = document.getElementById('heic-script')
        if (installed) {
            return (installed as any).promise
        }
        const script = document.createElement('script')
        script.id = 'heic-script'
        const promise = new Promise(resolve=>{
            script.onload = resolve
        })
        script.src = "/static/heic2any.min.js"
        document.body.appendChild(script);
        (script as any).promise = promise
        return promise
    }

    fileinput(e: InputEvent) {
        const input = e.currentTarget! as HTMLInputElement
        const files = (e.currentTarget!  as HTMLInputElement).files;

        if (files?.length) {
            Array.from(files).forEach((file: any) => {
                if (
                    file.type.toLowerCase() === "image/heic" ||
                    file.name.toLowerCase().includes(".heic" || file.type.toLowerCase() === "image/heif" ||
                    file.name.toLowerCase().includes(".heif"))
                    ) {
                        (window as any).heic2any({ blob: file, toType: "image/jpeg", quality: 1 }).then(
                            (newImage: File) => {
                                const that = this;
                                let img = document.createElement("img")
                                const url = URL.createObjectURL(newImage);
                                img.src = url;
                                img.onload = function() {
                                    setTimeout(() => {
                                        const canv = document.createElement("canvas");
                                        canv.width = img.width;
                                        canv.height = img.height;
                                        document.body.appendChild(canv);
                                        const ctx = canv.getContext('2d');
                                        ctx?.drawImage(img, 0, 0);
                                        let dataUrl = canv.toDataURL("image/jpeg")
                                        that.store.uploadFiles([new File([dataUrl], file.name, {type: "image/jpeg"})]).then(() => {
                                            canv.remove();
                                        })
                                        input.value = ''
                                    }, 0)
                                }
                            }).catch((newImage: File, e: any) => {
                                if(e.code === 1) {
                                    this.store.uploadFiles([new File([newImage], file.name, {type: "image/jpeg"})]).then(() => {
                                        document.querySelectorAll("canvas").forEach(el => el.remove())
                                    })
                                }
                            });
                    } else {
                        this.store.uploadFiles(Array.from([file]))
                    }
                });
        }
    }

    addNewImage(img: string) {
        const newImage = new Image();
        newImage.src = img;
        newImage.width = 300;
        document.body.appendChild(newImage);
    }

    private updateOnUploadStatus = () => {
        this.requestUpdate();
        this.snackbarOpen = true;
        this.numberOfFiles = this.store.uploads.length;
        this.uploadedFiles = this.store.uploads.filter(upload => upload.done).length;
        if(this.uploadedFiles) {
            this.store.getMenuItemCount();
        }
        this.failedUploads = this.store.uploads.filter(upload => upload.error !== null).length;
    }

    disconnectedCallback() {
        this.store.removeEventListener(StoreEvent.uploadsUpdate, this.updateOnUploadStatus)
    }

    toggleModal() {
        this.modalOpen = !this.modalOpen;
    }

    closeSnackbar() {
        this.snackbarOpen = false;
        this.store.clearUploads()
    }

    render() {
        return html`
            <input type="file" @input=${this.fileinput} multiple accept="image/jpeg, image/png, image/heic, image/heif" id="fileupload" />

                <div class="snackbar" data-opened=${this.snackbarOpen}>
                    <div class="snackbar-info">
                        <div class="snackbar-file">
                            
                            ${!this.failedUploads ? html`<div>Processed ${this.uploadedFiles} / ${this.numberOfFiles}</div>` : ""}
                            ${this.failedUploads ? html`<div>${this.failedUploads} Failed</div>` : ""}
                        </div>
                        <div class="snackbar-buttons">
                            <button class="button button-ghost-primary-500" @click=${this.toggleModal}>${this.modalOpen ? "Less" : "Details"}</button>
                            <button @click=${this.closeSnackbar} ?disabled=${this.numberOfFiles > this.uploadedFiles} class="button button-ghost-primary-500">Close</button>
                        </div>
                    </div>
                    <div class="modal" data-opened=${this.modalOpen}>
                        ${this.store.uploads.map(upload => html`
                            <div class="upload-item">
                                <div class="upload-item-name">
                                    ${upload.file.name}
                                </div>
                                <div class="upload-error">
                                    ${upload.error?.message || upload.error?.code ? `Failed: ${upload.error?.message || upload.error?.code}` : ""}
                                </div>
                                <div class="progressbar" >
                                    <span class="scale"></span>
                                    <span class="progress" style="width: ${upload.percent}%" data-error=${upload.error?.message || upload.error?.code ? true : false}></span>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
        `;
    }

    static styles = [
        generalCss,
        buttonsCss,
        css`

        :host {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 360px;
        }

        .file-upload-button {
            position: absolute;
            top:calc(-2rem - var(--floating-button-size));
            right:2rem;
        }

        input {
            display: none;
        }
        .snackbar {
           display: none;
        }

        .snackbar[data-opened="true"] {
            background-color: var(--color-white);
            bottom: 0;
            box-shadow: var(--shadow-m);
            box-sizing: border-box;
            color: black;
            display: flex;
            flex-direction: column;
            height: auto;
            justify-content: space-between;
            overflow-y: auto;
        }

        .snackbar-info {
            align-items: center;
            background: var(--color-primary-500);
            color: var(--color-white);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0.55rem 1.4rem;
        }

        .modal {
            display: none;
            max-height: 50vh;
            overflow-y: auto;
        }

        .modal[data-opened="true"] {
            box-sizing: border-box;
            display: block;
            padding: 22px;
        }

        .upload-item {
            padding: 0.6rem 0;
        }

        .upload-item div {
            display: flex;
            justify-content: space-between;
        }
        
        .upload-item .upload-item-name {
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            display:block;
        }

        .upload-item .icon {
            color: var(--color-grey);
            font-size: var(--font-size-base);
        }

        .upload-item .upload-error {
            color: var(--color-grey);
            padding: 0.4rem 0;
        }

        .upload-item .progressbar {
            display: flex;
            flex-direction: column;
        }

        .upload-item span.scale {
            background-color: var(--color-grey-light);
            display: inline-block;
            height: 2px;
            width: 100%;
        }

        .upload-item span.progress {
            background-color: var(--color-primary-500);
            bottom: 2px;
            display: inline-block;
            height: 2px;
            position: relative;
        }

        .upload-item .progress[data-error="true"] {
            background-color: var(--color-error);
        }

        @media (max-width: 568px) {
            :host {
                width: 100%;
            }
        }
        @media (min-width:768px){
            :host {
                bottom: 3rem;
            }
        }
    `];
}
