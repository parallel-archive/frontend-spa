import { html, css } from 'lit';
import { Widget } from "./Widget";
import { customElement, property } from 'lit/decorators.js';
import { buttonsCss } from './css/buttons.css';

@customElement('pagination-widget')
export class Pagination extends Widget {

    @property({ type: Boolean, attribute: "first" })
    first = true

    @property({ type: Boolean, attribute: "last" })
    last = false

    @property({ type: Number, attribute: "numberofelements" })
    numberOfElements = 0

    @property({ type: Number, attribute: "number" })
    number = 0

    @property({ type: Number, attribute: "size" })
    size = 0

    @property({ type: Number, attribute: "totalpages" })
    totalPages = 0

    @property({ type: Number, attribute: "totalelements" })
    totalElements = 0

    beginning(e: Event) {
        e.preventDefault()
        this.sendEvent("paginate", {
            page: 0
        })
    }

    back(e: Event) {
        e.preventDefault()
        this.sendEvent("paginate", {
            page: this.number - 1
        });
    }

    forward(e: Event) {
        e.preventDefault()
        this.sendEvent("paginate", {
            page: this.number + 1
        })
    }

    end(e: Event) {
        e.preventDefault()
        this.sendEvent("paginate", {
            page: this.totalPages - 1
        })
    }

    private get firstItemIndex() {
        return this.number * this.size
    }

    private get isOnFirstPage() {
        return this.number === 0
    }

    private get isOnLastPage() {
        return this.number >= this.totalPages - 1
    }

    render() {
        return this.totalPages > 1 ? html`
            <div>
                <div class="control-panel">
                    <button ?disabled=${this.isOnFirstPage} class="button arrow beginning" @click=${this.beginning}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dd382d">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button ?disabled=${this.isOnFirstPage} class="button arrow" @click=${this.back}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dd382d">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div class="numbers">${this.firstItemIndex + 1} - ${this.firstItemIndex + Math.min(this.size, this.totalElements - this.firstItemIndex)}
                    <span class="of-total"> of ${this.totalElements}</span></div>
                    <button ?disabled=${this.isOnLastPage} class="button arrow" @click=${this.forward}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dd382d">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button ?disabled=${this.isOnLastPage} class="button arrow end" @click=${this.end}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dd382d">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div> 
            </div>
        `:'';
    }

    static styles = css`
        ${buttonsCss}
        .numbers{
            margin:0.5rem;
            line-height: 1rem;
            font-size:0.8rem;
            min-width: 8rem;
            text-align: center;
            color:var(--color-primary-400);
        }
        .control-panel {
            align-items: center;
            display: flex;
            justify-content: center;
            white-space: nowrap;
        }

        .arrow {
            margin:0.7rem;
            width: 1.5rem;
            display: inline-block;
            padding:0;
            line-height:0;
            background: transparent;
            border: none;
            cursor: pointer;
        }
        @media screen and (min-width:1024px){
            .arrow {
                margin-block:0;
            }
        }
    `;

}