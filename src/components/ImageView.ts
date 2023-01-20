import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { buttonsCss } from './css/buttons.css';
import { formCss } from './css/form.css';
import { WidgetWithStore } from './WidgetWithStore';
import { ShoeBoxImage } from "../store/Store.types"
import "./Modal";
import { ImageFit } from '../main.types';
import { previewCss } from './css/preview.css';

@customElement('image-view')
export class ImageView extends WidgetWithStore {
    static styles = [
        formCss,
        buttonsCss,
        previewCss,
        css`
            .delete-confirm {
                padding: 0.5rem 1rem;
                min-width: 30ch;
            }
            .image-container {
                position: absolute;
                inset:0;
                overflow:auto;
            }
            .img-wrap {
                margin: 4rem 0 15rem 0;
            }
            img {
                display:block;
            }
        
            .rotate-button {
                padding: 0.5rem;
                border-radius:10000px;
                margin:0.25rem;
            }
            .rotate-left, .rotate-right {
                display:block;
                background-color: white;
                -webkit-mask: url('/static/rotate.svg') no-repeat center;
                mask: url('/static/rotate.svg') no-repeat center;
            }
            .rotate-right {
                transform: scale(-1, 1);
            }
            
            input[type="text"].styled-input {
                max-width: calc(100vw - 3rem);
            }
            .last-modified {
                color: var(--color-grey);
                font-size: var(--font-size-small);
            }
            
            input[type="text"].styled-input {
                max-width: 100%;
                width: 100%;
            }

            .save-and-exit {
                display:flex;
                align-items:center;
                justify-content:space-between;
            }
            .save-and-exit :is(button, a){
                border-radius:0;
                padding: 0.7rem 1rem;
                border: none;
                box-shadow: var(--shadow-m);
            }
            .block {
                height: calc(100vh - 56px);
                position: relative;
                overflow:hidden;
                box-sizing:border-box;
            }
            @media(min-width:1024px){
                .block{
                    height: 100vh;
                }
            }
            .max-width {
                margin: auto;
                max-width: 960px;
            }
            .upper-controls{
                position:absolute;
                padding:1rem;
                z-index:1;
            }
            .lower-controls {
                position: absolute;
                box-sizing: border-box;
                bottom:1rem;
                left:50%;
                transform:translate(-50%);
                background-color:white;
                min-width:320px;
                padding:0.2rem 1rem;
                box-shadow: var(--shadow-m);
                font-weight: 500;
            }
            .lower-controls button {
                font-weight: 500;
            }
            .loader-img {
                display:none;
            }
            .img-wrap {
                display:grid;
                place-items:center;
            }
            .img-wrap img, .img-wrap canvas {
                display:none;
            }
            .img-wrap .img-shown {
                display:block;
            }
            .img-wrap .upside-down {
                transform: rotate(180deg);
            }
            .img-wrap .horizontal {
                width:100%;
                max-width:1440px;
            }
            .img-wrap .vertical {
                height:calc(100vh - 10rem);
            }
            .img-wrap .magnifier.x2 {
                transform:scale(2);
                transform-origin: top left;
            }
            img.x2, canvas.x2 {
                margin-bottom:5rem;
            }
            .lift-preview-controls{
                z-index:1;
            }
            .edit-data-row {
                display:flex;
                align-items: flex-end;
            }
            .rename-block {
                flex:1;
            }
            .rename-block .styled-input-label {
                color: var(--color-primary-400);
                font-weight:500;
            }
            .rename-block .styled-input, .rename-block .styled-input:focus {
                border: none;
                font-weight:500;
                border-radius:0;
                border-bottom: 2px solid var(--color-grey);
                padding-top:2rem;
                padding-bottom:0.5rem;
            }
            
            .buttons-container {
                display:flex;
                flex-direction:column;
                margin-left: 0.8rem;
            }
            .delete-button {
                border: 1px solid var(--color-primary-500);
            }
            @media(min-width:640px){
                .lower-controls {
                    min-width: 560px;
                }
                .buttons-container {
                    flex-direction:row;
                    margin-top:1rem;

                }
                .edit-data-row {
                    align-items:center;
                }
                .rotate-button {
                    margin:0.5rem;
                }
            }
            @media (min-width:1024px){
                .img-wrap {
                    padding-left: calc(var(--desktop-menu-full-width) + 1rem);
                    padding-right: 1rem;
                }
                .lower-controls {
                    --left: calc(var(--desktop-menu-full-width) + 1rem);
                    left: calc(var(--left) + (100vw - var(--left))/2)
                }
            }

        `
    ];

    @query('input', true)
    _imageName!: HTMLInputElement;

    @query('canvas', true)
    canvas!: HTMLCanvasElement;

    @property({ type: String, attribute: "image-id" })
    imageId = ""

    @state()
    saving = false

    @state()
    saved = false

    @state()
    dirty = false

    @state()
    imageData: Partial<ShoeBoxImage & { error: { message: string; code: string; }; }> | undefined;

    @state()
    angle = 0;

    @state()
    confirmOpen = false

    @property()
    name = ""

    @state()
    previewMode:ImageFit = 'horizontal'

    constructor() {
        super();
        this.loadData();
    }

    firstUpdated() {
        document.body.setAttribute('data-overlay-open', 'data-overlay-open')
    }

    loadData() {
        let id = window.location.pathname.split("/").pop() || "";
        let imageId = this.imageId ? this.imageId : id;
        this.store.getImage(imageId).then(data => {
            this.imageData = data;
            this.angle = this.imageData?.rotation || 0;
            this.name = this.imageData?.name || "";
        })
    }

    @state()
    imageLoaded = false

    imgLoad(e:Event){
        const img = e.target as HTMLImageElement
        this.imageLoaded = true
        this.canvas.width = img.naturalHeight
        this.canvas.height = img.naturalWidth
        const ctx = this.canvas.getContext('2d')
        ctx?.translate(img.naturalHeight,0)
        ctx?.rotate(Math.PI / 2)
        ctx?.drawImage(img,0,0)
    }

    rotate(angle = 90) {
        return (e: Event) => {
            e.preventDefault();
            this.angle = (360 + this.angle + angle) % 360;
            this.dirty = true;

        }
    }

    saveChanges(e: Event) {
        e.preventDefault();
        this.saving = true;
        this.store.saveImageEdit(+this.imageId, this._imageName.value, this.angle)
            .then(d => {
                this.saving = false;
                this.saved = !d.error;
                this.dirty = false;
                this.loadData();
            });
    }

    delete(): void {
        this.store.deleteImages([+this.imageId])
            .then(() => {
                this.gotoRoute('/uploadedimages')
            });
    }

    openConfirm() {
        this.confirmOpen = true;
    }

    closeConfirm() {
        this.confirmOpen = false;
    }

    render() {
        return html`
            <global-menu user=${(this.store?.user?.name || "")}></global-menu>
            <div class="block">
                <div class="upper-controls">
                    <button @click=${this.openConfirm} class="button button-primary-500 delete-button">Delete</button>
                </div>
                <div class="preview-controls lift-preview-controls">
                    <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'horizontal' ? 'mode-active':''}" @click=${() => this.previewMode = 'horizontal'}>
                        <img class="preview__horizontal-fit-icon" width="16" height="16" />
                    </button>
                    <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'vertical' ? 'mode-active':''}" @click=${() => this.previewMode = 'vertical'}>
                        <img class="preview__vertical-fit-icon" width="16" height="16" />
                    </button>
                    <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'original' ? 'mode-active':''}" @click=${() => this.previewMode = 'original'}>1x</button>
                    <button class="button button-ghost-primary-500 preview-ghost-button ${this.previewMode === 'x2' ? 'mode-active':''}" @click=${() => this.previewMode = 'x2'}>2x</button>
                </div>
                <form class="main" @submit=${this.saveChanges}>
                    <div class="image-container">
                        <div class="img-wrap" style=${this.imageLoaded ? '' : 'visibility:hidden;'}>
                            <div class="magnifier ${this.previewMode}">
                                <img @load=${this.imgLoad} src="${this.imageData?.url || ""}" alt="">
                                <img class="${this.previewMode} ${this.angle % 180 === 0 ? 'img-shown' : '' } ${this.angle === 180 ? 'upside-down' : '' }" src="${this.imageData?.url || ""}" alt="">
                                <canvas class="${this.previewMode} ${this.angle % 180 === 90 ? 'img-shown' : '' } ${this.angle === 270 ? 'upside-down' : '' }" ></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="lower-controls">
                        <div class="edit-data-row">
                            <div class="rename-block">
                                <label class="styled-input-label">Image Name</label>
                                <input type="text" .value=${this.name} @input=${() => this.dirty = true} class="styled-input" required>
                            </div>
                            <div class="buttons-container">
                                <button @click=${this.rotate(-90)} class="button rotate-button button-primary-500">
                                    <img width="16" height="16" class="rotate-left" />
                                </button>
                                <button @click=${this.rotate(90)} class="button rotate-button button-primary-500">
                                    <img width="16" height="16" class="rotate-right" />
                                </button>
                            </div>
                        </div>
                        <div class="save-and-exit">
                            <div>
                                <a href="/uploadedimages" class="button button-ghost-primary-500">Back to Uploaded Images</a>
                            </div>
                            <div>
                                <button type="submit" ?disabled=${this.saving || !this.dirty} class="button button-primary-500 save">
                                ${this.saving
                ? 'Saving'
                : this.dirty
                    ? 'Save Changes'
                    : this.saved
                        ? 'Saved'
                        : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <osa-modal
                action-button-text="Delete"
                @action=${this.delete}
                ?open=${this.confirmOpen}
                @cancel=${this.closeConfirm}>
                <p class="delete-confirm">Delete Image?</p>
            </osa-modal>
        `;
    }
}