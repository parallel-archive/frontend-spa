
import "./ChickletInput";import "./ImageSelectModal";
import { html, css } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { messages } from '../consts/messages';
import { buttonsCss } from './css/buttons.css';
import { formCss } from './css/form.css';
import { generalCss } from './css/general.css';
import { WidgetWithStore } from './WidgetWithStore';
import { DocumentCreateRequestBody, DocumentImage, DocumentSaveRequestBody, DocumentGetRequestMeta } from '../store/Store.types';
import { smoothDragOrder } from '@codeandsoda/smooth-drag-order'
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ImageFit } from "../main.types";
import { previewCss } from "./css/preview.css";
import { gotoParentPage } from '../utils/utils'

import "./Modal";
import { actionButtonsCss } from "./css/action-buttons.css";
import "./GlobalMenu";

type imageWithUid = DocumentImage & { uid: number };

@customElement('edit-document')
export class EditDocument extends WidgetWithStore {

    @queryAll("select[name='countrySelect'] option")
    countrySelectOptions!: HTMLOptionElement[]

    @queryAll("select[name='languageSelect'] option")
    languageSelectOptions!: HTMLOptionElement[]

    @queryAll("select[name='typeSelect'] option")
    typeSelectOptions!: HTMLOptionElement[]

    @query("#metadata-form")
    metadataForm!: HTMLFormElement

    @query("#imagelist")
    imageListContainer!: HTMLElement

    @queryAll("input[data-required]")
    inputFields!: HTMLInputElement[]

    @queryAll(".error")
    inputErrors!: HTMLElement[]

    @query("input[name='periodCoveredFrom']")
    periodFrom!: HTMLInputElement

    @query("input[name='periodCoveredTo']")
    periodTo!: HTMLInputElement

    @property({ type: String, attribute: "document-id" })
    documentId = ''

    @state()
    shoeboxModalOpen = false

    @state()
    previewed: imageWithUid | null = null

    @state()
    images: imageWithUid[] = []

    @state()
    meta: DocumentGetRequestMeta = {}

    @state()
    countryIdList: number[] = []

    @state()
    languageIdList: number[] = []

    @state()
    typeIdList: number[] = []

    @state()
    tagList: string[] = []

    @state()
    metadataOpen = false

    @state()
    previewMode: ImageFit = 'horizontal'

    @state()
    confirmOpen = false

    @state()
    publishOpen = false

    @state()
    publishing = false

    @state()
    publishFeedback = ""

    @state()
    ocrOpen = false

    @state()
    ocrRunning = false

    @state()
    ocrFeedback = ""

    @state()
    ocrEditMode = false

    @state()
    ocrLimitReached = false

    @state()
    published = false

    @state()
    imageOrderChanged = false

    @state()
    saving = false

    @state()
    noUploadedImage = false

    private uid = 0;

    @state()
    tagString: string = "";

    @state()
    ocrChanges:string = '';
    @state()
    ocrChangesSaved:boolean = false;

    constructor() {
        super();
        document.addEventListener("document-header-click", this.openMetadataDrawer.bind(this));
    }
    addUid = (image: DocumentImage): imageWithUid => {
        return Object.assign({}, image, { uid: this.uid++ })
    }

    openMetadataDrawer(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this.metadataOpen = !this.metadataOpen;
        if(!this.metadataOpen) {
            this.clearValidation();
        }
    }

    addImagesFromShoebox(e: CustomEvent<DocumentImage[]>) {
        this.shoeboxModalOpen = false

        const payload: DocumentCreateRequestBody = {
            id: +this.documentId || undefined,
            imageIds: e.detail.map(image => image.id)
        }
        this.store.addImagesToDocument(payload).then(d => {
            if (!d.error) {
                if(d.images) {
                    d.images = d.images.map(im => {
                        im.uploadedAt = new Date(im.uploadedAt);
                        return im;
                    })

                    this.images = d.images.map(this.addUid)
                    this.noUploadedImage = !this.images.length;
                }
                history.replaceState({ path: `/edit-document/${d.id}` }, '', `/edit-document/${d.id}`)
            }
        })
    }

    async firstUpdated() {
        if (this.documentId) {
            this.store.loadDocument(+this.documentId).then(d => {
                this.images = d.images?.map(this.addUid) || []
                this.meta = d.metaData || {}
                this.meta.originalTitle = this.meta.originalTitle
                this.noUploadedImage = !this.images.length;
                if (d.metaData?.countriesCovered?.filters) {
                    this.countryIdList = d.metaData?.countriesCovered?.filters.filter(f => f.active).map(f => f.id);
                }
                if (d.metaData?.languages?.filters) {
                    this.languageIdList = d.metaData?.languages?.filters.filter(f => f.active).map(f => f.id);
                }
                if (d.metaData?.types?.filters) {
                    this.typeIdList = d.metaData?.types?.filters.filter(f => f.active).map(f => f.id);
                }
                if (d.metaData?.tags) {
                    this.tagList = d.metaData?.tags;
                    this.tagString = d.metaData?.tags.join();
                }
            })
        }

        smoothDragOrder(this.imageListContainer, 0.2, true)
    }

    orderChange() {
        const orderedIds = [...this.imageListContainer.children]
            .map(c => Number((c as HTMLElement).dataset.id))
        this.images = [...this.images.sort((a, b) => orderedIds.indexOf(a.uid) - orderedIds.indexOf(b.uid))]
        this.imageOrderChanged = true
    }

    moveToTop(image: imageWithUid) {
        this.images = [image, ...this.images.filter(im => im !== image)]
        this.imageOrderChanged = true
    }
    moveToBottom(image: imageWithUid) {
        this.images = [...this.images.filter(im => im !== image), image]
        this.imageOrderChanged = true
    }
    removeImage(image: imageWithUid) {
        this.images = [...this.images.filter(im => im !== image)]
        this.imageOrderChanged = true
    }
    clickImage(image: imageWithUid) {
        this.previewed = image
        this.ocrEditMode = false;
        document.body.setAttribute('data-overlay-open', 'data-overlay-open')
    }
    closePreview() {
        this.previewed = null
        this.ocrEditMode = false;
        this.ocrChangesSaved = false;
        document.body.removeAttribute('data-overlay-open')
    }

    convertMeta(source: HTMLFormElement) {
        return {
            archiveCategory: source.archiveCategory.value || undefined,
            archiveName: source.archiveName.value || undefined,
            catalogUrl: source.catalogUrl.value || undefined,
            referenceCode: source.referenceCode.value || undefined,
            countriesCovered: this.countryIdList || undefined,
            createdAtYear: Number(source.createdAtYear.value) || undefined,
            languages: this.languageIdList || undefined,
            originalTitle: source.originalTitle.value || undefined,
            originalAuthor: source.originalAuthor.value || undefined,
            periodCoveredFrom: Number(source.periodCoveredFrom.value) || undefined,
            periodCoveredTo: Number(source.periodCoveredTo.value) || undefined,
            publication: source.publication.value || undefined,
            sourceUrl: source.sourceUrl.value || undefined,
            types: this.typeIdList || undefined,
            tags: this.tagList || undefined
        }
    }

    updated() {
        if (this.imageOrderChanged && !this.ocrEditMode) {
            this.saving = true;

            const payload: DocumentSaveRequestBody = {
                id: +this.documentId || undefined,
                images: this.images.map((image,index) => ({ imageId: image.id, index: index, ocr: image.ocr })),
                metaDataRequest: this.convertMeta(this.metadataForm)
            }
            this.store.saveDocument(payload).then(d => {
                if (!d.error) {
                    history.replaceState({ path: `/edit-document/${d.id}` }, '', `/edit-document/${d.id}`)
                }
            })
            this.imageOrderChanged = false;
            setTimeout(() => {
                this.saving = false;
            }, 1000)
        }
    }

    getSelectedCountries() {
        this.countryIdList = Array.from(this.countrySelectOptions).filter(f => f.selected).map(f => +f.value);
    }

    getSelectedLanguages() {
        this.languageIdList = Array.from(this.languageSelectOptions).filter(f => f.selected).map(f => +f.value);
    }

    getSelectedTypes() {
        this.typeIdList = Array.from(this.typeSelectOptions).filter(f => f.selected).map(f => +f.value);
    }

    setTags(e: CustomEvent) {
        this.tagList = e.detail.tags
    }

    save(e?: SubmitEvent) {
        e && e.preventDefault()
        if(this.validatePeriod()) {
            const payload: DocumentSaveRequestBody = {
                id: +this.documentId || undefined,
                images: this.images.map((image, idx) => ({ imageId: image.id, index: idx, ocr: image.ocr })),
                metaDataRequest: this.convertMeta(this.metadataForm)
            }
            return this.store.saveDocument(payload).then(d => {
                if (!d.error) {
                    if(d.images) {
                        this.images = d.images.map(this.addUid);
                    }
                    this.noUploadedImage = !this.images.length;
                    if(d.metaData) {
                        this.meta = d.metaData;
                    }
                    history.replaceState({ path: `/edit-document/${d.id}` }, '', `/edit-document/${d.id}`)
                    if(e) this.metadataOpen = !this.metadataOpen;
                }
                this.clearValidation();
            })
        }
        return false;
    }
    saveOCREdit(text:string, image:imageWithUid | null){
        if(!image) return;
        image.ocr = text
        this.ocrChanges = ''
        this.ocrChangesSaved = true;
        this.save()
    }

    openConfirm() {
        this.confirmOpen = true;
    }

    closeConfirm() {
        this.confirmOpen = false;
    }

    openPublish() {
        this.publishOpen = true;
    }

    closePublish(clear=true) {
        this.publishOpen = false;
        clear ? this.clearValidation() : "";
        this.ocrLimitReached = false;
    }

    openOcr() {
        this.ocrOpen = true
    }

    closeOcr() {
        this.ocrFeedback = ""
        this.ocrOpen = false
    }

    runOCR() {
        this.ocrRunning = true;
        this.store.generateOCR(+this.documentId)
            .then(d => {
                this.ocrRunning = false;
                if (!d.error && !d.messages?.length) {
                    if(d.images) {
                        this.images = d.images.map(this.addUid);
                    }
                    this.noUploadedImage = !this.images.length;
                    if(d.metaData) {
                        this.meta = d.metaData;
                    }
                    this.ocrFeedback = "OCR completed.";
                } else if(d.messages?.length) {
                    if(d.messages.filter(m => m.id === "OCR_LIMIT_REACHED")) {
                        this.ocrFeedback = "You have reached your OCR text generation limit for the hour. You may use the service again in the next hour."
                    }
                } else {
                    this.ocrFeedback = "OCR failed. Please try again later."
                }
            })
    }
    

    deleteDocument() {
        this.store.deleteDocument(+this.documentId)
            .then(() => {
                this.closeConfirm();
                this.gotoRoute('/privatedocuments');
        })
    }

    validateAndPublish() {
        if(this.validateFormFields()) {
            this.publish();
        } else {
            this.openMetadataDrawer(new CustomEvent("open", {}));
            this.closePublish(false);
        }
    }

    validateFormFields() {
        let invalidFields: HTMLInputElement[] = []
        Array.from(this.inputFields).forEach(i => {
            if(i.value !== "") {
                invalidFields.includes(i) ? invalidFields.splice(invalidFields.indexOf(i), 1) : "";
            } else {
                invalidFields.push(i);
                if (i.previousElementSibling) {
                    i.previousElementSibling.textContent = "Missing field";
                }
            }
        })
        return !invalidFields.length;
    }

    clearValidation() {
        this.inputErrors.forEach(el => el.textContent = "");
        this.publishFeedback = "";
    }

    validatePeriod() {
        if(this.periodFrom.value && this.periodTo.value && (+this.periodTo.value < +this.periodFrom.value)) {
            this.periodTo.previousElementSibling!.textContent = "must be larger than 'from'";
            return false;
        }
        return true;
    }

    clearFieldError(element: Element | null) {
        if(element) {
            element!.textContent = ""
        }
        return true;
    }

    async publish() {
        this.publishing = true;
        window.umami?.("Publish document");
        const response = await this.store.publishDocument(this.documentId)
        if(response?.result === "PUBLISH_SCHEDULED") {
            this.published = true;
            this.publishFeedback = "You have just published your document. You will soon receive an email containing your publication's URL. You will now be redirected to your private documents.";
        } else if(response?.result === "OCR_LIMIT_REACHED") {
            this.ocrLimitReached = true;
            this.publishFeedback = "You have reached your OCR text generation limit for the hour. You may try publishing your document in the next hour.";
        } else {
            this.publishFeedback = response.error ? `${messages.PUBLISH_ERROR} ${response.error?.message}`: messages.PUBLISH_ERROR;
        }
        this.publishing = false;
        this.store.getMenuItemCount();
    }

    goToPublication() {
        history.replaceState({},"", "/privatedocuments");
        gotoParentPage("privatecollections/mydocuments/?publishing=true");
    }

    thisYear = new Date().getFullYear()
    render() {
        return html`
            <global-menu document-name=${ifDefined(this.meta.originalTitle)} user=${(this.store?.user?.name || "")} slim></global-menu>
            <div class="action-buttons">
                <div class="manage-document-buttons">
                    <button @click=${() => this.shoeboxModalOpen = true} class="button button-floating-primary-800 select-images">Add Images</button>
                    <button class="button button-primary-500" @click=${this.openPublish} ?disabled=${!this.documentId}>Publish</button>
                    <button class="button button-primary-500 umami--click-run-ocr" @click=${this.openOcr} ?disabled=${!this.documentId || !this.images.length}>Run OCR</button>
                    <button class="button button-primary-300" @click=${this.openConfirm} ?disabled=${!this.documentId}>Delete</button>
                </div>
                <div class="action-buttons__navigation">
                    <a class="button button-ghost-primary-500" href="/uploadedimages">Back to Uploaded Images</a>
                    <a class="button button-ghost-primary-500" href="/privatedocuments">Back to Private Documents</a>
                </div>
            </div>
            <a class="desktop-doc-title-wrap" @click=${this.openMetadataDrawer}>
                <h1>${this.meta.originalTitle || "[Untitled Document]"}</h1>
                <div><button class="button button-primary-500 edit-document">Edit</button></div>
            </a>
            <form id="metadata-form" @submit=${this.save} data-drawer-open=${this.metadataOpen}>
                <div class="form-cols">
                    <div class="col col-1">
                        <div class="field">
                            <label for="originalTitle">Original Title</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" pattern="\\S+.*" value=${ifDefined(this.meta.originalTitle)} type="text" required title="No leading white space" name="originalTitle" id="originalTitle" placeholder="[Untitled Document]" data-required />
                        </div>
                        <div class="field">
                            <label for="originalAuthor">Original Author</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" pattern="\\S+.*" value=${ifDefined(this.meta.originalAuthor)} type="text" name="originalAuthor" id="originalAuthor" placeholder="The actual author of the paper"/>
                        </div>
                        <div class="field">
                            <label for="createdAtYear">Date Created (year)</label>
                            <span class="error"></span>
                            <input name="createdAtYear" class="styled-input" value=${ifDefined(this.meta.createdAtYear)} type="number" step="1" min="1800" max=${this.thisYear} id="createdAtYear"/>
                        </div>
                        <div class="field">
                            <label for="sourceUrl">Source URL</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.sourceUrl)} type="text" name="sourceUrl" id="sourceUrl"/>
                        </div>
                        <div class="field">
                            <label>Period Covered (year)</label>
                            <div class="periodinput">
                                <div class="periodfrom">
                                    <label for="periodCoveredFrom">from</label>
                                    <span class="error"></span>
                                    <input class="styled-input" name="periodCoveredFrom" value=${ifDefined(this.meta.periodCoveredFrom)} type="number" step="1" min="0" max=${this.thisYear} id="periodCoveredFrom" @blur="${this.validatePeriod}"/>
                                </div>
                                <div>
                                    <label for="periodCoveredTo">to</label>
                                    <span class="error"></span>
                                    <input class="styled-input" name="periodCoveredTo" value=${ifDefined(this.meta.periodCoveredTo)} @focus=${() => this.clearFieldError(this.periodTo.previousElementSibling)} type="number" step="1" min="0" max=${this.thisYear} id="periodCoveredTo" @blur="${this.validatePeriod}"/>
                                </div>
                            </div>
                        </div>
                        <div class="field select-field">
                            <label for="countriesCovered">Countries Covered</label>
                            <span class="error"></span>
                            ${this.meta.countriesCovered?.filters ?
                                html`<select multiple name="countrySelect" class="full-width styled-input" @change=${() => this.getSelectedCountries()}>
                                        ${repeat(this.meta.countriesCovered?.filters, filter => html`
                                        <option ?selected=${filter.active} value=${filter.id}>${filter.name.displayName}</option>`)
                                        }
                                    </select>` :
                                ""
                            }
                        </div>
                        <div class="field">
                            <label for="tags">Tags</label>
                            <chicklet-input placeholder="asd" id="tags" tags="${ifDefined(this.tagString)}" @chicklet-change=${this.setTags}></chicklet-input>
                        </div>
                    </div>
                    <div class="col col-2">
                        <div class="field">
                            <label for="archiveCategory">Archive Category</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.archiveCategory)}  id="archiveCategory" name="archiveCategory"/>
                        </div>
                        <div class="field">
                            <label for="archiveName">Archive Name</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.archiveName)}  id="archiveName" name="archiveName" data-required/>
                        </div>
                        <div class="field">
                            <label for="catalogUrl">Catalog URL</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.catalogUrl)}  type="text" id="catalogUrl" name="catalogUrl"/>
                        </div>
                        <div class="field">
                            <label for="referenceCode">Reference Code</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.referenceCode)}  type="text" id="referenceCode" name="referenceCode" data-required/>
                        </div>
                        <div class="field">
                            <label for="publication">Publication</label>
                            <span class="error"></span>
                            <input class="full-width styled-input" value=${ifDefined(this.meta.publication)}  id="publication" name="publication"/>
                        </div>
                        <div class="field select-field">
                            <label for="languages">Languages</label>
                            <span class="error"></span>
                            ${this.meta.languages?.filters ?
                                html`<select multiple name="languageSelect" class="full-width styled-input" @change=${() => this.getSelectedLanguages()}>
                                        ${repeat(this.meta.languages?.filters, filter => html`
                                            <option ?selected=${filter.active} value=${filter.id}>${filter.name.displayName}</option>`)
                                        }
                                    </select>` :
                                ""
                            }
                        </div>
                        <div class="field select-field">
                            <label for="types">Types</label>
                            <span class="error"></span>
                            ${this.meta.types?.filters ?
                                html`<select multiple name="typeSelect" class="full-width styled-input" @change=${() => this.getSelectedTypes()}>
                                        ${repeat(this.meta.types?.filters, filter => html`
                                            <option ?selected=${filter.active} value=${filter.id}>${filter.name.displayName}</option>`)
                                        }
                                    </select>` :
                                ""
                            }
                        </div>
                    </div>
                </div>
                <div class="meta-form-bottom-buttons">
                    <button class="button button-primary-500" @click=${this.openMetadataDrawer}>Close</button>
                    <button class="button button-primary-500">Save</button>
                    <button class="button button-primary-500" @click=${this.openPublish} ?disabled=${!this.documentId}>Publish</button>
                </div>
            </form>
            <div class="main">
                <div>
                    <div id="imagelist" @change=${() => this.ocrEditMode ? "" : this.orderChange()}>
                    ${repeat(this.images, im => im.uid, image => html`
                        <div  class="image-card-wrap" data-id=${image.uid}>
                            <div class="image-card-inner-wrap">
                                <div drag-handle>
                                    <div class="dragbar">
                                        <img @click=${() => this.moveToTop(image)} alt="move to top" title="move to top" class="move-icon-up" src="/static/chevron-right.svg" />
                                        <img alt="drag" title="drag" class="drag-icon" src="/static/drag-dots.svg" />
                                        <img @click=${() => this.moveToBottom(image)} alt="move to bottom" title="move to bottom" class="move-icon-down" src="/static/chevron-right.svg" />
                                    </div>
                                </div>
                                <div class="image-card">
                                    <img @click=${() => this.clickImage(image)} class="image" width="150" height="150" src=${image.thumbnailUrl} />
                                    <div class="info" @click=${() => this.clickImage(image)}>
                                        <div class="image-title">${image.name.split('_').join(' ')}</div>
                                        <div class="image-added">Date Added</div>
                                        <div class="image-added-date">${image.uploadedAt.toLocaleDateString()}</div>
                                    </div>
                                    <div @click=${() => this.removeImage(image)} class="delete-icon-wrap">
                                        <img class="delete-icon" width="20" height="20" />
                                    </div>
                                    ${image.ocr ? html`<button @click=${() => this.clickImage(image)} class="button edit-ocr-button button-primary-300">Edit OCR</button>` : ''}
                                </div>
                            </div>
                        </div>
                    `)}
                    </div>
                </div>
                ${this.noUploadedImage
                ? html`<div class="empty-document">Empty document.<button @click=${() => this.shoeboxModalOpen = true} class="button button-primary-500">add images</button></div>`
                : ""}
            </div>
            ${this.previewed ? html`
                <div class=${"preview" + (this.previewed.ocr ? ' preview--with-ocr' : '')}>
                    <div class="preview-box">
                        <div class="preview-image-box">
                            <div class="preview-controls">
                                <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'horizontal' ? 'mode-active':''}" @click=${() => this.previewMode = 'horizontal'}>
                                    <img class="preview__horizontal-fit-icon" width="16" height="16" />
                                </button>
                                <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'vertical' ? 'mode-active':''}" @click=${() => this.previewMode = 'vertical'}>
                                    <img class="preview__vertical-fit-icon" width="16" height="16" />
                                </button>
                                <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'original' ? 'mode-active':''}" @click=${() => this.previewMode = 'original'}>1x</button>
                                <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'x2' ? 'mode-active':''}" @click=${() => this.previewMode = 'x2'}>2x</button>
                                <button class="button button-primary-500" @click=${this.closePreview}>Close</button>
                            </div>
                            <div class="preview-scroll">
                                <img class=${this.previewMode} src=${this.previewed.url} />
                            </div>
                        </div>
                        ${this.previewed.ocr
                            ? html`
                                <div class="ocr-in-preview-container">
                                    <div class="ocr-in-preview-header">
                                        <h3>OCR text</h3>
                                        <button ?disabled=${!this.ocrChanges} @click=${()=>this.saveOCREdit(this.ocrChanges, this.previewed)} class="button button-primary-500">
                                            ${this.ocrChanges || !this.ocrChangesSaved ? 'Save Changes' : 'Saved'}
                                        </button>
                                    </div>
                                    <textarea id="ocredit" @input=${(e:InputEvent) => this.ocrChanges = (e.currentTarget as HTMLInputElement)?.value}>${this.previewed.ocr}</textarea>
                                </div>
                                `
                            : ""
                        }
                    </div>
                    

                </div>
            ` : ''}
            <image-select-modal 
            ?open=${this.shoeboxModalOpen} 
            @select=${(e: CustomEvent) => this.addImagesFromShoebox(e)}
            @cancel=${() => this.shoeboxModalOpen = false}></image-select-modal>
            <osa-modal
                action-button-text="Delete"
                @action=${this.deleteDocument}
                ?open=${this.confirmOpen}
                @cancel=${this.closeConfirm}>
                <div class="confirm-message">Delete Document?</div>
            </osa-modal>
            <osa-modal
                action-button-text=${this.ocrLimitReached ? "Ok" : !this.published ? "Publish" : "Ok"}
                @action=${this.ocrLimitReached ? this.closePublish : !this.published ? this.validateAndPublish : this.goToPublication}
                ?open=${this.publishOpen}
                @cancel=${() => this.ocrLimitReached ? this.closePublish() : !this.published ? this.closePublish(true) : this.gotoRoute("/privatedocuments")}
                ?action-disabled=${this.publishing}>
                ${!this.publishFeedback
                    ? html`<div class="confirm-message">Clicking "Publish", will make this document publicly available in the Public Archive.
                    Publishing will also generate OCR text for your document.
                    </div>
                        ${this.publishing
                        ? html`<div class="loading"></div>`
                        : ""}`
                    : html`
                    <div class="confirm-message">
                        <span>${this.publishFeedback}</span>
                    </div>
                    `}
            </osa-modal>
            <osa-modal
                action-button-text=${!this.ocrFeedback ? "Run OCR" : "Ok"}
                @action=${!this.ocrFeedback ? this.runOCR : this.closeOcr}
                ?open=${this.ocrOpen}
                @cancel=${() => !this.ocrRunning ? this.closeOcr() : ""}
                ?action-disabled=${this.ocrRunning}>
                ${!this.ocrFeedback
                    ? html`<div class="confirm-message">Running OCR will generate text from every page of this document. This might take some time. Once it is completed, you will have an editable version of the text.</div>
                        ${this.ocrRunning
                        ? html`<div class="loading"></div>`
                        : ""}`
                : html`
                <div class="confirm-message">
                    <span>${this.ocrFeedback}</span>
                </div>
                `}
            </osa-modal>
            ${!this.imageOrderChanged && this.saving ? html`<div class="image-save-snack">Saving</div>` : ''}
        `;
    }

    static styles = [
        generalCss,
        formCss,
        buttonsCss,
        previewCss,
        actionButtonsCss,
        css`
            :host {
                display: block;
            }
            
            form {
                background: var(--color-grey-light);
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                left: 0;
                padding: 2rem 9% 5rem;
                position: fixed;
                right: 0;
                top: calc(-100% - 3.5rem);
                top: 3.5rem;
                transition: transform 0.4s ease;
                transform: translateY(-100vh);
                max-height:calc(100vh - 3.5rem);
                overflow-y:auto;
                z-index: 2;
            }
            form label {
                font-size:0.8em;
                font-weight:100;
            }
            form input.styled-input {
                padding-left:0; padding-right:0;
                background-color:transparent;
                color: var(--color-primary-400);
                border:none;
                border-bottom:2px solid var(--color-primary-400);
                border-radius:0;
            }
            form input.styled-input:focus {
                border:none;
                color: var(--color-primary-400);
                border-bottom:2px solid var(--color-primary-400);
            }
            form input.styled-input::placeholder {
                color: gray;
            }
            form select {
                background-color:transparent;
            }
            form select::-webkit-scrollbar {
               width: 0.5rem;
            }
            form select::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            form select::-webkit-scrollbar-thumb {
                background: #888;
            }
            form option:checked {
                background-color:var(--color-primary-400, #dd382d);
                color: white;
            }
            .meta-form-bottom-buttons {
                display:flex;
                gap:1rem;
            }

            .meta-form-bottom-buttons button {
                width: 50%;
            }

            @media(min-width: 1024px) {
                .meta-form-bottom-buttons button {
                    width: 120px;
                }
            }

            .select-field {
                margin-top:1rem;
                margin-bottom:1rem;
            }

            select {
                margin-bottom: 1rem;
            }

            form[data-drawer-open="true"] {
                transform: translateY(0);
                padding-top:4rem;
            }

            .form-cols {
                display: grid;
                grid-template-columns: minmax(0,auto);
                grid-template-rows: repeat(2, auto);
                width:100%;
            }
            
            input.styled-input {
                max-width: 100%;
                padding: 10px;
            }
            form button {
                width: 120px;
            }

            .edit-ocr-button {
                position:absolute;
                bottom: 0.5rem;
                right: 0.5rem;
                font-size: 0.8rem;
                padding:0.25rem 0.5rem;
                border-radius:0;

            }
            
            .button-floating-primary-800 {
                position: unset;
                width:unset;
                height:unset;
                border-radius:unset;
            }

            .desktop-doc-title-wrap {
                margin-left: var(--desktop-menu-stacked-width);
                cursor:pointer;
                display:block;
                text-decoration:none;
                padding: 0 2rem;
                display:flex;
                align-items: center;
                display:none;
                color:#6e6e6e;
            }
            .desktop-doc-title-wrap h1 {
                line-height:1;
                margin-top:1.5rem;
                margin-bottom:1.7rem;
                margin-right:0.5rem;
            }
            
            @media(min-width: 1024px) {
                .desktop-doc-title-wrap {
                    display:flex;
                }
                .manage-document-buttons {
                    width:100%;
                }
                .manage-document-buttons button:first-child {
                    margin-top:0.5em;
                }
                form[data-drawer-open="true"] {
                    padding-top: 3.5rem;
                }
            }
            .manage-document-buttons {
                display: flex;
                gap: 1rem;
                width:100%;
                justify-content:space-between;
                background-color: var(--color-primary-400);
            }
            .full-width{
                width:100%;
            }
            .periodinput {
                display: grid;
                grid-template-rows: repeat(2,1fr);
                grid-template-columns: 1fr;

                gap: 9px;
                max-width: 100%;
            }
            @media(min-width: 768px) {
                .periodinput {
                    grid-template-columns: repeat(2,1fr);
                    grid-template-rows: 1fr;
                }
                .periodfrom .error{
                    margin-right:0.5rem;
                    transform: translate(44%, 140%);
                }
                label[for="periodCoveredTo"] ~ .error {
                    transform: translate(-3%, 140%);
                }
            }
            @media(min-width: 1024px) and (max-width: 1353px) {
                label[for="periodCoveredTo"] ~ .error {
                    transform: translate(-30%, 140%);
                }
            }
            @media (min-width: 1329px) {
                label[for="periodCoveredTo"] ~ .error {
                    transform: translate(-3%, 140%);
                }
            }
            .periodinput input {
                width: 100%;
            }
            .image-card-wrap {
                display:flex;
            }
            .image-card-wrap.dragged .image-card-inner-wrap {
                box-shadow: 0px 4px 5px 0px rgba(0,0,0,0.3);
                
            }
            @media(min-width: 768px) {
                .periodinput div {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                }
            }
            .delete-icon-wrap {
                position:absolute;
                padding:0.4rem;
                right:0;
                cursor:pointer;
            }
            .image-card-wrap {
               overflow:hidden;
               
            }
            .image-card-inner-wrap{
                display:flex;
                width:100%;
                margin:0.5rem 1rem;
                transition: box-shadow 0.3s ease;
            }
            .delete-icon {
                background-color: var(--color-primary-500);
                -webkit-mask: url('/static/x-circle.svg') no-repeat center;
                mask: url('/static/x-circle.svg') no-repeat center;
            }
            .info {
                cursor: pointer;
                margin:0.5rem;
                margin-right: 2rem;
                font-size:0.8rem;
                display:flex;
                flex-direction:column;
                justify-content: space-between;
                width: 100%;
            }
            .image-card {
                position:relative;
                border: 1px solid var(--color-grey-light);
                background-color: var(--color-white);
                display:flex;
                position:relative;
                flex:1;
            }
            .image-card .image {
                cursor: pointer;
                display:block;
                width:110px;
                height:110px;
                object-fit:cover;
                flex: 0 0 auto;
                margin:0.5rem;
            }
            .image-title {
                color: var(--color-primary-400);
                text-transform: uppercase;
                font-size:0.8rem;
                font-weight:500;
                margin-bottom: auto;
                max-width:18ch;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .image-added {
                color: var(--color-primary-400);
                font-weight:500;
            }
            .image-added-date {
                font-weight:500;
            }
            @media (min-width:568px){
                .image-card .image {
                    width: 200px;
                    height: 200px;
                }
                .info {
                    font-size:1rem;
                }
            }
            .x2 {
                padding-bottom: 20vh;
            }
            [drag-handle]{
                display:flex;
                cursor:pointer;
            }
            .dragbar {
                width:2rem;
                flex: 0 0 auto;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                align-items:center;
                background-color: var(--color-bg-grey);
            }
            .dragbar img {
                opacity:1;
            }

            .drag-icon {
                cursor:grab;
            }

            .move-icon-up, .move-icon-down {
                display:block;
                width:2rem;
                padding:0.4rem;
                cursor:pointer;
            }
            .move-icon-up {
                transform: rotate(-90deg);
            }
            .move-icon-down {
                transform: rotate(90deg);
            }
            @media(min-width:600px){
                .image-title {
                    font-size:1rem;
                    max-width:35ch;
                }
            }
            @media(min-width: 1024px) {
                .image-title {
                    font-size:1.3rem;
                    max-width:25ch;
                }
                form {
                    padding: 2rem;
                    padding-left: calc(var(--desktop-menu-stacked-width) + 2rem);
                    top: 0;
                    height: 100vh;
                    max-height:unset;
                }
                .form-cols {
                    gap: 2rem;
                    grid-template-columns: repeat(2, 1fr);
                    max-width: 768px;
                }
                .main {
                    padding-top: 1rem;
                    padding-left: var(--desktop-menu-stacked-width);
                    max-width:calc(800px + var(--desktop-menu-stacked-width));
                    margin-left:1rem;
                }

            }

            @media(min-width: 352px) {
                .confirm-message {
                    min-width: 300px;
                }
            }
            .confirm-message {
                margin: 1rem;
                max-width:50ch;
            }

            .image-save-snack {
                background: var(--color-grey-light);
                border-radius: 3px;
                bottom: 2rem;
                color: var(--color-black);
                left: 0;
                margin: 0 auto;
                padding: .5rem;
                position: fixed;
                right: 0;
                text-align: center;
                width: 100px;
            }

            .empty-document {
                text-transform: uppercase;
                color: var(--color-grey);
                text-align:center;
            }
            .empty-document button {
                margin-left:0.5rem;
                position:relative;
                top:-0.1em;
                font-size:1rem;
                padding: 0.7rem 1rem;
                transition: box-shadow 0.3s ease;
            }
            .empty-document button:hover {
                box-shadow: 0px 4px 10px 0px rgba(153,0,0,0.5);
            }

            @media (min-width:1024px){
                .empty-document {
                    text-align:left;
                    margin-left:1rem;
                }
            }

            .form-error[data-hidden="hidden"] {
                display: none;
            }

            label {
                display: inline-block;
            }

            label ~ .error {
                color: var(--color-error);
                display: inline-block;
                margin-left: 6px;
                position: absolute;
            }
        `
    ]
}
