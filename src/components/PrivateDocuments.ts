import {html, css} from 'lit';
import {customElement, queryAll, state} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import { formCss } from './css/form.css';
import { generalCss } from './css/general.css';
import { buttonsCss } from './css/buttons.css';
import { DocumentData } from "../store/Store.types";

import "./Pagination";
import "./Modal";
import { actionButtonsCss } from './css/action-buttons.css';
import "./GlobalFooter";
import "./GlobalMenu";

@customElement('private-documents')
export class PrivateDocuments extends WidgetWithStore {

    @state()
    _documents: DocumentData[] = [];

    @state()
    confirmOpen = false

    @state()
    documentIdToDelete = 0

    @queryAll(".document-card input[type='checkbox']")
    documentCardCheckboxes!: HTMLInputElement[]

    constructor() {
        super();
        this.loadDocuments();
    }

    loadDocuments() {
        this.store.loadDocuments(this.store.documentsSort, this.store.documentPage.number)
            .then(d => {
                if(d.documentDataPage?.content) {
                    this._documents = d.documentDataPage?.content;
                }
            })
    }

    deleteDocument() {
        window.umami?.("Delete document draft");
        this.store.deleteDocument(this.documentIdToDelete)
            .then(() => {
                this.loadDocuments();
                this.closeConfirm();
                this.documentIdToDelete = 0;
                this.store.getMenuItemCount();
        })
    }

    openConfirm() {
        this.confirmOpen = true;
    }

    closeConfirm() {
        this.confirmOpen = false;
    }

    private get deleteDisabled() {
        return this.documentIdToDelete === 0;
    }

    selectDocument(id:number) {
        this.documentIdToDelete = id === this.documentIdToDelete ? 0 : id
        
    }

    paginate(e: CustomEvent) {
        this.documentIdToDelete = 0;
        this._documents = []
        this.store.loadDocuments(this.store.documentsSort, e.detail.page)
            .then(d => {
                if(d.documentDataPage?.content) {
                    this._documents = d.documentDataPage?.content;
                }
            });
    }

    sort(e: Event) {
        e.preventDefault();
        const val = (e.currentTarget as HTMLInputElement).value as "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE";
        this._documents = []
        this.store.loadDocuments(val, this.store.documentPage.number)
            .then(d => {
                if(d.documentDataPage?.content) {
                    this._documents = d.documentDataPage?.content;
                }
            });
    }

    createNewDocument() {
        this.store.addImagesToDocument({
            imageIds: []
        }).then(d => {
            if (!d.error) {
                this.gotoRoute(`/edit-document/${d.id}`);
                this.store.getMenuItemCount();
            }
        })
    }

    render() {
        return html`
            <div class="watermark">Private Documents</div>
            <global-menu title="Private Documents" slim user=${(this.store?.user?.name || "")}></global-menu>
            <div class="action-buttons">
                <button @click=${this.createNewDocument} class="button button-floating-primary-800 umami--click--create-empty-document">
                New Document
                </button>
                <button ?disabled=${this.deleteDisabled} @click=${this.openConfirm} class="button button-primary-500 delete-button">Delete</button>
            </div>
            <div class="options">
                <select @change=${this.sort}>
                    <option ?selected=${this.store.documentsSort === 'DESC&sortBy=DATE'} value="DESC&sortBy=DATE">Recently modified first</option>
                    <option ?selected=${this.store.documentsSort === 'ASC&sortBy=DATE'} value="ASC&sortBy=DATE">Recently modified last</option>
                    <option ?selected=${this.store.documentsSort === 'ASC&sortBy=NAME'} value="ASC&sortBy=NAME">Name A-Z</option>
                    <option ?selected=${this.store.documentsSort === 'DESC&sortBy=NAME'} value="DESC&sortBy=NAME">Name Z-A</option>
                </select>
            </div>
            <div class="main">
                <div class="document-grid" slot="pagination-data">
                    ${this._documents.map(document => html`
                        <div class="document-card">
                            <span class="published-label">published</span>
                            <a href="/edit-document/${document.id}" class="document-link">
                                <div class="document-image-container">
                                    <img width="150" src="${document.images?.[0]?.thumbnailUrl ? document.images?.[0]?.thumbnailUrl : "/static/placeholder-image.png"}">
                                </div>
                                <div class="document-info">
                                    <p class="document-info__original-title">${document.metaData?.originalTitle || '[Untitled Document]'}</p>
                                    <div class="document-info__top-row">
                                        <div class="document-info__bit">
                                            <span class="label">Last Modified:</span>
                                            <span class="document-info__last-modified">${document.modifiedAt?.toLocaleDateString()}</span>
                                        </div>
                                        <div class="document-info__bit">
                                            <span class="label">Source:</span>
                                            <span class="document-info__source-url">${document.metaData?.sourceUrl ? document.metaData?.sourceUrl : "-"}</span>
                                        </div>
                                    </div>
                                    <div class="document-info__bit">
                                        ${!!document.metaData?.tags?.length ? html`
                                            <span class="label">Tags:</span>
                                            <span>${document.metaData?.tags?.join(', ')}</span>
                                        ` : ''}
                                    </div>
                                </div>
                            </a>
                            <label class="select-checkbox">
                                <input type="checkbox" class="radio-like-checkbox" name="document"
                                value=${document.id || ''}
                                @click=${() => this.selectDocument(document.id || 0)}
                                .checked=${!!this.documentIdToDelete && this.documentIdToDelete === document.id}
                                />
                            </label>
                        </div>
                    `)}
                </div>
                <osa-modal
                    action-button-text="Delete"
                    @action=${this.deleteDocument}
                    ?open=${this.confirmOpen}
                    @cancel=${this.closeConfirm}>
                    <div class="confirm-message">Delete Document?</div>
                </osa-modal>
                <div class="bottom-container">
                    <div class="bottom-container__elem">
                        <pagination-widget
                            @paginate=${this.paginate}
                            ?first=${this.store.documentPage.first}
                            ?last=${this.store.documentPage.last}
                            numberofelements=${this.store.documentPage.numberOfElements}
                            number=${this.store.documentPage.number}
                            size=${this.store.documentPage.size}
                            totalpages=${this.store.documentPage.totalPages}
                            totalelements=${this.store.documentPage.totalElements}
                            >
                        </pagination-widget>
                    </div>
                </div>
                <global-footer></global-footer>
            </div>
        `;
    }

    static styles = [
        generalCss,
        formCss,
        buttonsCss,
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
                padding-bottom: 10rem;
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

            @media(min-width: 1024px) {
                .options {
                    top: 0;
                    padding-top: 1rem;
                    padding-left: var(--desktop-menu-stacked-width);
                    width:100%;
                    max-width:calc(800px + var(--desktop-menu-stacked-width) - 2rem);
                    margin-left:1rem;
                }
                .options select {
                    margin-right:-1rem;
                }
            }

            .document-grid {
                display: flex;
                flex-direction:column;
                gap: 1rem;
                width: 100%;
                min-height:100vh;
                margin: 0 auto;
            }

            .document-card {
                box-sizing: border-box;
                cursor: pointer;
                display: grid;
                grid-template-columns: 1fr 20px;
                height: calc(200px + 0.5rem);
                max-width: 100%;
                padding: .5rem;
                position: relative;
                margin: 0 1rem;
                background-color: white;
            }

            .published-label {
                display: none;
            }

            .document-card[data-published="data-published"] .published-label {
                align-items: center;
                background: var(--color-green);
                border-radius: 3px 0 3px 0;
                color: var(--color-white);
                display: flex;
                font-size: var(--font-size-small);
                justify-content: center;
                padding: 6px 3px;
                position: absolute;
            }

            .document-image-container {
                display: none;
                align-content: center;
                justify-content: center;
            }
            
            img {
                max-height: calc(218px - 1.6rem);
            }

            .document-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin: 0.5rem .2rem;
                color: var(--color-grey);
                font-size: var(--font-size-small);
                font-weight: 500;
                height:calc(100% - 1rem);
            }
            .document-info__top-row {
                display: flex;
                gap: 1.5rem;
                border-bottom: 1px solid var(--color-primary-400);
                margin-bottom:1rem;
                padding-bottom:0.5rem;
            }
            .document-info__last-modified {
                white-space: nowrap;
            }

            .document-link {
                text-decoration: none;
            }


            .document-info .label {
                color: var(--color-primary-400);
                font-size: var(--font-size-small);
                margin-right: 0.5rem;
            }

            .document-info__original-title {
                color: var(--color-primary-400);
                text-transform: uppercase;
                display: block;
                line-height: 1.4rem;
                font-size: 1.3rem;
                margin-top: 6px;
                max-height: 6rem;
                max-width:40ch;
                overflow: hidden;
                font-weight: 500;
                margin-bottom: auto;
            }

            

            .select-checkbox {
                display: grid;
                align-items: start;
                height: 18px;
                justify-content: center;
                padding: 0;
                position: static;
            }

            .select-checkbox input[type="checkbox"] {
                padding: 7px;
            }

            .select-checkbox input[type="checkbox"].radio-like-checkbox {
                border-radius: 11px;
            }

            .delete-button {
                opacity:1;
                transition:opacity 0.3s;
            }

            .delete-button:disabled {
                opacity:0.7;
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

            .confirm-message {
                margin: 1rem;
                max-width:50ch;
            }


            .button-floating-primary-800 {
                z-index: 3;
            }

            @media(min-width: 352px) {
                .confirm-message {
                    min-width: 300px;
                }
            }

            @media (min-width: 768px){

                .document-grid {
                    max-width: 960px;
                }

                .document-card {
                    grid-template-columns: 1fr 20px;
                }

                .document-link {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                }
                .document-image-container {
                    display: block;
                }

                .document-image-container img{
                    width:200px;
                    height:200px;
                    display: block;
                    object-fit: cover;
                }

                .document-info {
                    margin: 0.5rem 1.3rem 0.5rem 2.2rem;
                }

                

                .bottom-container__elem {
                    position:initial;
                }
            }

            @media (min-width: 1024px){
                .bottom-container {
                    left: calc(var(--desktop-menu-stacked-width) + 0.5rem);
                    max-width:calc(800px - 1rem);
                    bottom:1rem;
                }

                .document-grid {
                    padding-left: var(--desktop-menu-stacked-width);
                    max-width:calc(800px + var(--desktop-menu-stacked-width));
                    margin-left:1rem;
                }

                .document-card {
                    width: 770px;
                    margin:0;
                }

                
            }
            .main {
                padding-bottom: 0;
            }
        `
    ]
};
