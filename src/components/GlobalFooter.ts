import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import { generalCss } from './css/general.css';

@customElement('global-footer')
export class GlobalFooter extends LitElement {
    static styles = [
        generalCss,
        css`
            :host {
                width: 100%;
            }
            :host main {
                color: var(--color-grey);
                align-items: baseline;
                display: grid;
                padding: 0 2rem 2rem;
                grid-template-columns: 1fr;
                margin: 0;
                margin-top: 1rem;
                width: 100%;
                margin-bottom: 0;
            }
            :host section {
                display: grid;
                grid-template-columns: 1fr;
            }
            
            @media(min-width: 1024px) {
                :host main {
                    grid-template-columns: 1fr;
                    padding: 0 2rem 2rem;
                }
                :host section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
                :host {
                    margin-bottom: -2rem;
                    padding-bottom: 4rem;
                    padding-left: var(--desktop-menu-stacked-width);
                    max-width:calc(800px + var(--desktop-menu-stacked-width));
                }
            }

            :host div {
                display: grid;
                grid-template-columns: 1fr;
            }

            @media(min-width: 410px) {
                :host div {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media(min-width: 1024px) {
                :host div {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            a {
                color: var(--color-primary-800);
                opacity: 0.8;
                text-decoration: none;
                opacity: 0.8;
                margin: 1rem 0 0 0;
            }
            a:hover {
                text-decoration: underline;
            }
        `
    ];

    render() {
        return html`
            <main>
                <section>
                    <p>Supported by the Institute of Record</p>
                    <p>All rights reserved Parallel Archive ©2008</p>
                </section>
                <div>
                    <a href="/terms_of_use">Terms of Use</a>
                    <a href="/user_manual">User Manual</a>
                    <a href="/privacy_policy">Privacy Policy</a>
                    <a href="/copyright_policy">Copyright Policy</a>
                    <a href="/collection_policy">Collection Policy</a>
                    <a href="/community_guidelines">Community Guidelines</a>
                    <a href="/contact_us">Contact</a>
                    <a href="/faq">Frequently Asked Questions</a>
                </div>
            </main>
        `;
    }
}
