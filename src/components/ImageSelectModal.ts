import {html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import { ShoeBoxImage } from '../store/Store.types';
import { buttonsCss } from './css/buttons.css';
import { formCss } from './css/form.css';
import { generalCss } from './css/general.css';
import { imageGrid } from './css/image-grid.css';

@customElement('image-select-modal')
export class ImageSelectModal extends WidgetWithStore {
    
    @property({type:Boolean, attribute:'open'})
    modalOpened = false

    @state()
    selected:ShoeBoxImage[] = []

    @state()
    noUploadedImage = false

    paginate(e: CustomEvent) {
        this.selected = []
        this.store.loadShoeBox(this.store.shoeBoxSort, e.detail.page)
    }
    
    sort(e: InputEvent) {
        this.selected = []
        const val = (e.currentTarget as HTMLInputElement).value as "ASC&sortBy=NAME" | "DESC&sortBy=NAME" | "DESC&sortBy=DATE" | "ASC&sortBy=DATE";
        this.store.loadShoeBox(val, this.store.shoeBox.number)
    }

    checkboxClick(image:ShoeBoxImage){
        this.selected.includes(image)
           ? this.selected = this.selected.filter(im=>im !== image)
           : this.selected = [...this.selected, image]
    }

    imageSelectState: 'NOT LOADED' | 'LOADING' | 'DONE' = 'NOT LOADED'
    startSelection(){
        if(this.imageSelectState === 'NOT LOADED'){
            this.imageSelectState = 'LOADING'
            this.store.loadShoeBox(this.store.shoeBoxSort, this.store.shoeBox.number)
                .then(d => {
                    this.imageSelectState = d.error ? 'NOT LOADED' : 'DONE'
                    this.noUploadedImage = !d.images?.content?.length;
                })
        }
    }
    updated(map: Map<string, any>) {
        if (map.get('modalOpened') === false) this.startSelection()

    }
    select(){
        this.dispatchEvent(new CustomEvent('select', {detail:[...this.selected]}))
        this.selected = []
    }
    cancelSelect(){
        this.dispatchEvent(new Event('cancel'))
        this.selected = []
    }

    render() {
        return html`
            <osa-modal
                action-button-text="Select Images"
                @action=${this.select}
                ?action-disabled=${this.selected.length === 0}
                @cancel=${this.cancelSelect}
                ?open=${this.modalOpened}>
                <div class="image-choose-modal-body">
                    <div class="header">
                        ${!this.noUploadedImage
                            ? html`
                            <select @change=${this.sort}>
                                <option ?selected=${this.store.shoeBoxSort === 'DESC&sortBy=DATE'} value="DESC&sortBy=DATE">Recently modified first</option>
                                <option ?selected=${this.store.shoeBoxSort === 'ASC&sortBy=DATE'} value="ASC&sortBy=DATE">Recently modified last</option>
                                <option ?selected=${this.store.shoeBoxSort === 'ASC&sortBy=NAME'} value="ASC&sortBy=NAME">Name A-Z</option>
                                <option ?selected=${this.store.shoeBoxSort === 'DESC&sortBy=NAME'} value="DESC&sortBy=NAME">Name Z-A</option>
                            </select>` : ""}
                    </div>
                    <div class="middle">
                        <div class="image-grid image-grid--in-modal">
                            ${this.store.shoeBox.content.map(image => html`
                            <div @click=${() => this.checkboxClick(image)} class="image-card image-card-selector">
                                <label class="select-checkbox">
                                    <input type="checkbox"
                                    .checked=${this.selected.includes(image)}
                                    />
                                </label>
                                <div class="image-container">
                                    <img width="150" src="${image.activeThumbnailUrl || image.thumbnailUrl}">
                                </div>
                                <div class="image-card__info">
                                    <div class="image-card__info_name">${image.name}</div>
                                    <div class="image-card__date">
                                        <span class="image-card__date-added">Date Added</span>
                                        <span class="image-card__info_uploaded">${image.uploadedAt.toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            `)}
                        </div>
                        ${this.noUploadedImage
                        ? html`<div class="center-content empty-shoebox">Upload images in <a class="button button-primary-500" href="/uploadedimages">Uploaded Images</a></div>`
                        : ""}
                    </div>
                    <div class="footer">
                        <div class="pagination-container">

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
                </div>
            </osa-modal>
        `;
    }

    static styles = [
        generalCss,
        formCss,
        buttonsCss,
        imageGrid,
        css`
            @media(min-width:768px){

                .pagination-container{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0.5rem;
                }
            }
            .image-card-selector {
                cursor:pointer;
            }
            .header {
                display:flex;
                justify-content:flex-end;
                margin: 0.7rem;
            }
            .image-grid--in-modal {
                width:1000px;
                max-width: 100%;
                margin: 0;
                overflow-x:hidden;
            }
            .image-choose-modal-body {
                display:flex;
                flex-direction:column;
                overflow:hidden;
                height:calc(90vh - 7rem);
            }

            select{
                background-color:transparent;
            }

            .image-choose-modal-body .header, .image-choose-modal-body .footer {
                flex:0 1 auto;  
            }
            .image-choose-modal-body .middle {
                overflow-y:scroll;
                flex:1 1 100%;
            }
            .empty-shoebox {
                display: flex;
                justify-content: center;
                align-items: center;
                text-transform: uppercase;
                color: var(--color-grey);
            }
            .empty-shoebox a {
                display: inline-block;
                margin-left: .5rem;
                text-decoration: none;
            }

        `
    ];
}