import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Widget } from './Widget';
import { WidgetWithStore } from './WidgetWithStore';
import { formCss } from './css/form.css';

@customElement('chicklet-widget')

export class ChickletWidget extends Widget {
    static styles = [
        formCss,
        css`
            :host {
                display: inline-block;
                font-size: var(--font-size-medium);
                background: var(--color-white);
                color: var(--color-black);
                border: 1px solid var(--color-grey-light);
                border-radius: 3px;
                padding: 3px calc(2 * var(--font-size-medium)) 3px 6px;
                margin: 3px;
                line-height: 1.5;
                position: relative;
            }
    
            button {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 6px;
                margin: auto;
                border: none;
                background: transparent;
                padding: 0;
                cursor: pointer;
                width: var(--font-size-xsmall);
                height: var(--font-size-xsmall);
            }
    
            button svg {
                width: var(--font-size-xsmall);
                height: var(--font-size-xsmall);
            }
    
            button svg path {
                fill: var(--color-grey);
            }
    
            button:hover svg path {
                fill: var(--color-black);
            }
    
            .offscreen {
                position: absolute;
                clip: rect(1px, 1px, 1px, 1px);
                padding: 0;
                border: 0;
                height: 1px;
                width: 1px;
                overflow: hidden;
            }`
    ];

    private _value: any;

    @state()
    type = ""

    @state()
    id = ""

    set value(value) {
        this._value = value;
    }

    get value() {
        return this._value || this.textContent;
    }

    handleClose() {
        const close_event = new CustomEvent("chicklet-close", {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: this.value
        });
        this.dispatchEvent(close_event);
    }

    render() {
        return html`
        <slot></slot>
        <button id="close" @click=${this.handleClose}>
        <span class="offscreen">Remove ${this.value}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill-rule="evenodd" d="M22 2.289L19.711 0 11 8.711 2.289 0 0 2.289 8.711 11 0 19.711 2.289 22 11 13.289 19.711 22 22 19.711 13.289 11z"/></svg>
        </button>
      `;
    }
}

@customElement('chicklet-input')

class ChickletInput extends WidgetWithStore {
    static ChickletWidget: typeof ChickletWidget;
    
    static styles = [
        formCss,
        css`
            :host {
                display: flex;
                flex-flow: column wrap;
            }
            input.styled-input {
                margin: 0;
                max-width: 100%;
                padding: 10px 0;
                border: none;
                border-bottom:2px solid var(--color-primary-400);
                background-color:transparent;
                border-radius:0;
                color: var(--color-primary-400);
            }
            input.styled-input:focus {
                border: none;
                border-bottom:2px solid var(--color-primary-400);
                color:var(--color-primary-400);
                margin-bottom: 0;
            }
            input.styled-input::placeholder {
                color:gray;
            }
            input.styled-input[shake="shake"] {
                /* border: 1px solid var(--color-error); */
                animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                transform: translate3d(0, 0, 0);
            }
            @keyframes shake {
                10%, 90% {
                    transform: translate3d(-1px, 0, 0);
                }
                20%, 80% {
                    transform: translate3d(2px, 0, 0);
                }
                30%, 50%, 70% {
                    transform: translate3d(-4px, 0, 0);
                }
                40%, 60% {
                    transform: translate3d(4px, 0, 0);
                }
            }
            #suggestion-list {
                transform: scaleY(0);
                position: absolute;
                transition: transform .1s ease-out, position .3s ease-out;
                transform-origin:top;
            }
            #suggestion-list[open="open"] {
                border-radius: 3px;
                transform: scaleY(1);
                margin: 0;
                padding: 0;
                position: relative;
                transition: transform 0.1s ease-out 0s, position 0.3s ease-out 0s;
                transform-origin: center bottom;
                width: 100%;
            }
            .suggestion {
                background: var(--color-white);
                list-style: none;
                padding: .5rem;
                border-bottom: 1px solid var(--color-grey-lighter);
            }
        `
    ]

    @query('input#real')
    private _realInput: HTMLInputElement | undefined

    @query('#suggestion-list')
    private suggestionContainer: HTMLUListElement | undefined
    
    @state()
    delimiter = ","

    @state()
    private _input: HTMLInputElement | null | undefined

    @state()
    name = "chicklets"

    @property({type: Boolean, attribute: "white-space-allowed"})
    whiteSpaceAllowed = true

    @property({ type: String, attribute: "tags" })
    tags!: string;
    
    @state()
    _chicklets: string[] = []
    
    @state()
    idAllocate = ""
    
    @property({type:String, attribute: "placeholder"})
    placeholder = ""

    @property({attribute: "aria-value"})
    ariaValue = ""

    @state()
    type = ""

    @state()
    label = ""

    constructor() {
        super();
        this.idAllocate = this.id ? this.id : 'main';
        this.value = this._chicklets.join(this.delimiter[0]);
        document.addEventListener("click", (e: Event) => {
            if(!(e.target as HTMLElement)?.matches("suggestion-list *")) {
                this.suggestionContainer!.innerHTML = "";
                this.suggestionContainer?.removeAttribute("open");
                if(this._input) {
                    this._input.value = "";
                }
            }
        })
    }

    get value() {
        return this._chicklets.join(this.delimiter[0]);
    }

    set value(value: string) {
        this._chicklets = value.split(this.delimiter[0]).map(ch => ch.trim()).filter(ch => ch);
        if (this._realInput) {
            this._realInput.value = this.value;
        }
        this.requestUpdate();
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        if(name === "tags" && value != "" && value != null) {
            this.tags = value;
            this._chicklets = this.tags.split(this.delimiter[0]).map(ch => ch.trim()).filter(ch => ch);
        }
    }

    add(value: string) {
        if(!this._chicklets.includes(value)) {
            this.value = this.value + this.delimiter[0] + value;
            this._chicklets = this.value.split(this.delimiter[0]).map(ch => ch.trim()).filter(ch => ch);
            if (this._realInput) {
                this._realInput.value = this.value;
            }
            this.requestUpdate();
        } else {
            this._input?.setAttribute("shake", "shake");
            setTimeout(() => {
                this._input?.removeAttribute("shake");
            }, 3000);
        }
    }

    firstUpdated() {
        if (this._realInput) {
            this._realInput.value = this.value;
        }

        this._input = this.shadowRoot?.querySelector("input#" + this.idAllocate);

        this.append(this._realInput!);

        this.shadowRoot?.addEventListener("chicklet-close", (e: Event) => {
            if(this.isCustomEvent(e)) {
                this.handleChickletClose(e)
            }
        });
        this.addEventListener("click", () => this._input?.focus());
    }

    isCustomEvent(event: Event): event is CustomEvent {
        return 'detail' in event;
    }

    _submitChange() {
        const change_event = new CustomEvent("chicklet-change", {
            bubbles: true,
            cancelable: true,
            detail: {
                value: this.value,
                tags: this._chicklets
            }
        });
        this.dispatchEvent(change_event);
    }

    async handleChickletClose(e: CustomEvent) {
        let index = this._chicklets.indexOf(e.detail);
        this._chicklets.splice(index, 1);
        this.requestUpdate();
        await this.updateComplete;

        const close_event = new CustomEvent("chicklet-close", {
            bubbles: true,
            cancelable: true,
            detail: e.detail
        });
        this.dispatchEvent(close_event);
        this._submitChange();
    }

    handleBeforeInput() {
        this.suggestionContainer!.innerHTML = "";
    }

    handleInput(e: InputEvent) {
        const key = e ? e.data : '';
        if(this._input && this._input?.value?.length >= 3) {
            this.autosuggest(this._input.value)
            .then(suggestList => {
                if(suggestList?.length) {
                    this.suggestionContainer!.innerHTML = "";
                    suggestList.forEach(s => {
                        let suggestion = document.createElement("li");
                        suggestion.textContent = s;
                        suggestion.classList.add("suggestion");
                        suggestion.setAttribute("tabindex", "0");
                        suggestion.addEventListener("click", (e) => this.handleAutocompletePick(e));

                        this.suggestionContainer?.appendChild(suggestion);
                        this.suggestionContainer?.setAttribute("open", "open");
                        suggestion?.addEventListener("keydown", e => {
                            this.handleKeyDown(e);
                            suggestion?.removeEventListener("keydown", this.handleKeyDown)
                        }, {once: true})
                    });
                }
            });
        }

        if (key && this.delimiter.includes(key) ||
            (!this.whiteSpaceAllowed && key?.match(/\s/))
        ) {
            if(this._input?.value) {
                this.add(this._input.value);
                this._submitChange();
                this._input.value = "";
            }
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.code === "Enter" && (e.target as HTMLElement).matches(".suggestion")) {
            this.handleAutocompletePick(e);
            e.stopPropagation();
        }
    }

    async autosuggest(tag: string) {
        const res = await this.store.autoSuggestTag(tag);
        if (!res.error && res.tags) {
            return res.tags;
        }
        return null
    }

    handleAutocompletePick(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        let suggestion = (e.target as HTMLElement).innerText
        this._input!.value = suggestion;
        this.add(suggestion);
        this._submitChange();
        this._input!.value = "";

        this.suggestionContainer!.innerHTML = "";
        this.suggestionContainer?.removeAttribute("open");
    }

    handleChange() {
        if(this._input && this.suggestionContainer?.innerHTML === "") {
            this.add((this._input as HTMLInputElement).value);
            this._input.value = "";
            this._submitChange();
        }
    }

    renderChicklets() {
        return this._chicklets.map(ch => html`<chicklet-widget .type=${this.type}>${ch}</chicklet-widget>`);
    }

    render() {
        return html`
        <input id="${this.idAllocate}" class="full-width styled-input" type="text" value="" aria-label="${this.label || ''}" aria-describedby="${this.ariaValue || ''}" placeholder=${this.placeholder || 'tags'}
        @input=${this.handleInput}
        @beforeinput=${this.handleBeforeInput}
        @change=${this.handleChange}
        >
        <input type="hidden" name=${this.name} value=${this.value} id="real">
        <ul id="suggestion-list"></ul>
        <div>${this.renderChicklets()}</div>
      `;
    }
}

ChickletInput.ChickletWidget = ChickletWidget;
