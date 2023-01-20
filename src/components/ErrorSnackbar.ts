import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { messages } from '../consts/messages';
import { StoreEvent } from '../store/Store.types';
import { WidgetWithStore } from './WidgetWithStore';

@customElement('error-snackbar')
export class ErrorSnackbar extends WidgetWithStore {
    static styles = css`
        .error-snackbar {
            position: fixed;
            top: calc(3.5rem + 1.4rem + 14px + 1rem);
            left: 50%;
            transform: translate(-50%, 0);
            padding: 0.5rem;
            background-color: white;
            z-index:200;
        }
        @media(min-width: 1024px) {
            .error-snackbar {
                top: 1rem;
            }
        }
        .error-snackbar[data-opened="true"] {
            background-color: var(--color-primary-500);
            color: var(--color-white);
            align-items: center;
            display: flex;
        }
        .error-snackbar[data-opened="true"] button {
            background-color: var(--color-white);
            height: 24px;
            width: 24px;
            border: none;
            mask: url("/static/x-circle.svg") no-repeat center;
            -webkit-mask: url("/static/x-circle.svg") no-repeat center;
            margin-left: 5px;
        }
    `;

    timeout = 0

    @state()
    open = false

    @property()
    errorMessage = ''

    constructor() {
        super();
        this.store?.addEventListener(StoreEvent.serverError, (e: any) => {
            if (this.open || e.detail.status === 401) return
            this.open = true;
            this.timeout = window.setTimeout(() => this.open = false, 5000);
            this.errorMessage = e.detail.error?.message
                || (navigator.onLine ? messages.UNKNOWN_ERROR : messages.OFFLINE_ERROR)
        })
    }

    disconnectedCallback(){
        clearTimeout(this.timeout)
    }

    close() {
        this.open = false;
    }

    render() {
        return this.open ? html`
            <div class="error-snackbar" data-opened=${this.open}>
                <span>${this.errorMessage}</span>
                <button @click=${this.close}></button>
            </div>
        ` : '';
    }
}