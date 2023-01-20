import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Widget } from './Widget';
import { buttonsCss } from "./css/buttons.css";
import { generalCss } from "./css/general.css";

@customElement('osa-modal')
export class Modal extends Widget {
    @property({ type: String, attribute: "action-button-text" })
    buttonText = ""

    @property({ type: Boolean, attribute: "action-disabled", reflect: true })
    actionDisabled = false

    @property({ type: Boolean, attribute: "open", reflect: true })
    open = false

    @query('#cancel')
    private _cancelButton!: HTMLElement

    openConfirm() {
        this.open = true;
    }

    cancel() {
        this.sendEvent("cancel", {});
    }

    action() {
        this.sendEvent("action", {});
    }

    updated(map: Map<string, any>) {
        if (map.get('open') === false) {
            this._cancelButton.focus()

        }
    }

    tabtrap() {
        this._cancelButton.focus()
    }

    clickOutside(e:PointerEvent){
        if((e.target as HTMLElement).id === 'modalbg') this.cancel()
    }

    render() {
        return html`
            <div class="confirm" data-open=${this.open} id="modalbg" @click=${this.clickOutside}>
                <div class="overlay-content">
                    <slot></slot>
                    <div class="buttons">
                        <button id="cancel" @click=${this.cancel} class="cancel button button-ghost-primary-500 mr-1">Cancel</button>
                        <button @click=${this.action} ?disabled=${this.actionDisabled} class="delete button button-primary-500">${this.buttonText}</button>
                        <input class="tabtrap" @focus=${this.tabtrap}/>
                    </div>
                </div>
            </div>
        `;
    }

    static styles = [
        generalCss,
        buttonsCss,
        css`
            .tabtrap{
                width:0;
                height:0;
                border:none;
                padding:0;
            }
            :host .confirm {
                display: none;
            }

            :host .confirm[data-open="true"] {
                align-items: center;
                background: var(--color-overlay-screen);
                bottom: 0;
                display: flex;
                height: 100%;
                justify-content: center;
                left: 0;
                position: fixed;
                right: 0;
                top: 0;
                width: 100%;
                z-index:100;
            }

            [data-open="true"] .overlay-content {
                background-color: var(--color-bg-grey);
                box-shadow: var(--shadow-l);
                box-sizing: border-box;
                max-width: 90%;
                max-height: 90%;
                overflow:auto;
                animation: modal 0.3s;
                position:relative;
            }

            @keyframes modal {
                0% {
                    opacity:0;
                    transform:translateY(1rem);
                }
                100% {
                    opacity:1;
                    transform:translateY(0);
                }
            }

            .buttons {
                margin: 1rem;
                display: flex;
                justify-content: flex-end;
            }
            .buttons button {
                border-radius:0;
                border:none;
                box-shadow: var(--shadow-m);
            }
        `
    ];

}