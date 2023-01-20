
import { html, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { generalCss } from './css/general.css';
import { formCss } from './css/form.css';
import { buttonsCss } from './css/buttons.css';
import { WidgetWithStore } from './WidgetWithStore';

import "./FileUpload";
import "./Pagination";
import "./Modal";
import { StoreEvent } from '../store/Store.types';
import { imageGrid } from './css/image-grid.css';
import { actionButtonsCss } from './css/action-buttons.css';
import { FileUpload } from './FileUpload';
import "./GlobalMenu";
import "./GlobalFooter";

@customElement('uploaded-images')
export class UploadedImages extends WidgetWithStore {
    static styles = [
        generalCss,
        formCss,
        buttonsCss,
        imageGrid,
        actionButtonsCss,
        css`
            :host {
                display: block;
            }
            global-footer {
                display: flex;
                justify-self: flex-end;
                align-self: center;
            }
            .main {
                max-width: 100%;
                margin: 0 auto;
                padding: 1.5rem 0;
                padding-bottom:10rem;
                position: relative;
            }
            .image-grid-wrap {
                min-height: calc(100vh - 304px);
            }
            .bottom-container{
                position: sticky;
                margin-top:1rem;
                bottom:0;
                right:0;
                width:100%;
                z-index: 2;
                background-color: white;
                box-shadow: 0 0 1rem 0 rgba(0,0,0,0.3)
            }
            .bottom-container__elem {
                position:relative;
            }
            .button-floating-primary-800 {
                z-index: 3;
            }
            @media (min-width: 1124px){
                .bottom-container__elem {
                    position:initial;
                }
            }
            

            
            .options {
                display: flex;
                align-items: center;
                position: sticky;
                top: 6rem;
                z-index: 1;
                padding: 0.5rem;
                margin: 0 auto;
                justify-content: flex-end;
                width: 960px;
                max-width: 100%;
                height: 44px;
            }

            .options select {
                background-color:#e5e5e5;
            }
            .options div {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            @media(min-width: 386px) {
                .options {
                    align-items: center;
                }

                .options div {
                    flex-direction: row;
                }
            }
            @media(min-width: 1024px) {
                .options select {
                    margin-right:-1rem;
                }
                .options {
                    top: 0;
                    padding-top: 1rem;
                    padding-left: var(--desktop-menu-stacked-width);
                    width:100%;
                    max-width:calc(800px + var(--desktop-menu-stacked-width) - 2rem);
                    margin-left:1rem;
                }
                .image-grid {
                    padding-left: var(--desktop-menu-stacked-width);
                    max-width:calc(800px + var(--desktop-menu-stacked-width) - 2rem);
                    margin-left:1rem;
                    padding-right:0;
                }
                .bottom-container {
                    left: calc(var(--desktop-menu-stacked-width) + 0.5rem);
                    max-width:calc(800px - 1rem);
                    bottom:1rem;
                }
            }
            .options pagination-widget {
                flex:1;
            }
            .new-document,
            .delete-button {
                opacity:1;
                transition:opacity 0.3s;
            }
            .new-document:disabled,
            .delete-button:disabled {
                opacity:0.7;
            }
            
            @media (min-width: 1124px){
                .bottom-container__elem {
                    position:initial;
                }
            }
            .pagination-container {
                box-shadow: var(--shadow-s);
            }
            @media(min-width: 352px) {
                .confirm-message {
                    min-width: 300px;
                }
            }
            .confirm-message {
                margin:1rem;
                max-width:50ch;
            }

            .empty-shoebox {
                text-transform: uppercase;
                color: var(--color-grey);
            }

            .main {
                padding-bottom: 0;
            }
        `
    ]


    private fileListIndex = 0
    private setFileListIndex() {
        const uploads = this.store.uploads
        this.fileListIndex = Math.max(uploads.map(u => u.done).indexOf(true), uploads.length)
    }

    @state()
    imageIdsToDelete: number[] = []

    @state()
    confirmOpen = false

    @state()
    noUploadedImage = false

    @query('file-upload')
    private _uploadInput?: FileUpload
    

    constructor() {
        super()
        this.store.loadShoeBox(this.store.shoeBoxSort, this.store.shoeBox.number).then(resp => {
            this.noUploadedImage = !resp.images?.content?.length;
        })
        this.setFileListIndex()
        this.store.addEventListener(StoreEvent.uploadsUpdate, () => {
            if (this.fileListIndex >= this.store.uploads.length) this.fileListIndex = 0
            const newFiles = this.store.uploads.slice(this.fileListIndex)
            if (newFiles.every(f => f.done) && newFiles.some(f => f.success)) {
                this.setFileListIndex()
                this.store.loadShoeBox(this.store.shoeBoxSort, this.store.shoeBox.number).then(() => {
                    this.noUploadedImage = !this.store.uploads?.length;
                })
                this.imageIdsToDelete = []
            }
        })
    }

    initUpload(){
        this._uploadInput?.open()
    }

    deleteImages(): void {
        this.store.deleteImages(this.imageIdsToDelete)
            .then(() => {
                this.store.loadShoeBox(this.store.shoeBoxSort, this.store.shoeBox.number)
                this.imageIdsToDelete = [];
                this.noUploadedImage = true;
                this.closeConfirm();
                this.store.getMenuItemCount();
            });
    }

    openConfirm() {
        this.confirmOpen = true;
    }

    closeConfirm() {
        this.confirmOpen = false;
    }

    private get deleteDisabled() {
        return !this.imageIdsToDelete.length;
    }

    mutateIdList(e: Event, id: number): number[] {
        e.stopPropagation();
        this.imageIdsToDelete.includes(id) ? this.imageIdsToDelete.splice(this.imageIdsToDelete.indexOf(id), 1) : this.imageIdsToDelete.push(id);
        this.requestUpdate();
        return this.imageIdsToDelete;
    }

    paginate(e: CustomEvent) {
        this.imageIdsToDelete = []
        this.store.loadShoeBox(this.store.shoeBoxSort, e.detail.page)
    }

    sort(e: Event) {
        this.imageIdsToDelete = []
        const val = (e.currentTarget as HTMLInputElement).value  as "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE";
        // const sortBy = (e.currentTarget as HTMLSelectElement).options[(e.currentTarget as HTMLSelectElement).selectedIndex]?.dataset.sortby as 'DATE' | 'NAME';
        this.store.loadShoeBox(val, this.store.shoeBox.number);
    }

    createNewDocument() {
        window.umami?.("Create new document from uploaded images")
        this.store.addImagesToDocument({
            imageIds: this.imageIdsToDelete
        }).then(d => {
            if (!d.error) {
                this.gotoRoute(`/edit-document/${d.id}`);
            }
        })
    }

    render() {
        return html`
            <div class="watermark">Uploaded Images</div>
            <global-menu title="Uploaded Images" slim user=${(this.store?.user?.name || "")}></global-menu>
            <div class="action-buttons fancy-scroll">
                <button @click=${this.initUpload} class="button button-primary-300 icon-plus">Upload Image
            <img class="icon" src="/static/plus-red.svg"/>
            </button>
                <button ?disabled=${!this.imageIdsToDelete.length} @click=${this.createNewDocument} class="button button-primary-300 new-document">New Document
                <img class="icon icon-bigger" src="/static/doc-plus.svg"/>
            </button>
                <button ?disabled=${this.deleteDisabled} @click=${this.openConfirm} class="button button-primary-500 delete-button">Delete
                <img class="icon" src="/static/trash.svg"/>

            </button>
            </div>
            <div class="options">
                <select @change=${this.sort}>
                    <option ?selected=${this.store.shoeBoxSort === 'DESC&sortBy=DATE'} value="DESC&sortBy=DATE">Recently modified first</option>
                    <option ?selected=${this.store.shoeBoxSort === 'ASC&sortBy=DATE'} value="ASC&sortBy=DATE">Recently modified last</option>
                    <option ?selected=${this.store.shoeBoxSort === 'ASC&sortBy=NAME'} value="ASC&sortBy=NAME">Name A-Z</option>
                    <option ?selected=${this.store.shoeBoxSort === 'DESC&sortBy=NAME'} value="DESC&sortBy=NAME">Name Z-A</option>
                </select>
            </div>
            <div class="main">
                <div class="image-grid-wrap">
                    <div class="image-grid">
                        ${this.store.shoeBox.content.map(image => html`
                            <div class="image-card"  @click=${() => this.gotoRoute(`/image/${image.id}`)}>
                                <label class="select-checkbox">
                                    <input type="checkbox" class=""
                                    @click=${(e: Event) => this.mutateIdList(e, image.id)}
                                    .checked=${this.imageIdsToDelete.includes(image.id)}
                                    />
                                </label>
                                <div class="image-card__clickable-area">
                                    <div class="image-container">
                                        <img width="150" src="${image.thumbnailUrl}" style="transform: rotate(${image.rotation}deg)">
                                    </div>
                                    <div class="image-card__info">
                                        <div class="image-card__info_name">${image.name}</div>
                                        <div class="image-card__date">
                                            <span class="image-card__date-added">Date Added</span>
                                            <span class="image-card__info_uploaded">${image.modifiedAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
                <osa-modal
                action-button-text="Delete"
                @action=${this.deleteImages}
                ?open=${this.confirmOpen}
                @cancel=${this.closeConfirm}>
                <div class="confirm-message">Delete Images?</div>
                </osa-modal>
                <div class="bottom-container">
                    <div class="bottom-container__elem">
                        <file-upload></file-upload>
                    </div>
                    <div class="bottom-container__elem pagination-container">
                        <pagination-widget
                        @paginate=${this.paginate}
                        ?first=${this.store.shoeBox.first}
                        ?last=${this.store.shoeBox.last}
                        numberofelements=${this.store.shoeBox.numberOfElements}
                        number=${this.store.shoeBox.number}
                        size=${this.store.shoeBox.size}
                        totalpages=${this.store.shoeBox.totalPages}
                        totalelements=${this.store.shoeBox.totalElements}
                        >
                        </pagination-widget>
                    </div>
                </div>
                <global-footer></global-footer>
            </div>
            
    `;
    }
}