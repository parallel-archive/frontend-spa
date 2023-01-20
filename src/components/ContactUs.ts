import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';

@customElement('contact-us')
export class ContactUs extends WidgetWithStore {
    static styles = css`
        :host {
            display: block;
        }
        main {
            margin: 0 auto;
            max-width: 90%;
            padding: 2rem 0;
            position: relative;
        }
        @media(min-width: 1024px) {
            :host main {
                max-width: 960px;
            }
        }
        @media(min-width: 1024px) {
            :host main {
                padding-left: calc(var(--desktop-menu-slim-width) + 130px);
                max-width: calc(800px + var(--desktop-menu-stacked-width));
                padding-right: 20px;
            }
        }
    `;

    render() {
        return html`
            <global-menu user=${(this.store?.user?.name || "")}></global-menu>
            <main>
                <h1>Contact</h1>
                <p>Please send inquiries relating to the Parallel Archive to: <b>support@parallelarchive.org</b></p>
                <p>Parallel Archive (PA) is operated by OSA Archivum.</p>
                <div>
                    <p>Address: H-1051 Budapest, Arany János u. 32.</p>
                    <p>Web: <a href="https://www.osaarchivum.org/">www.osaarchivum.org</a></p>
                    <p>Phone: (+36-1) 327-3250</p>
                    <p>Fax: (+36-1) 327-3260</p>
                    <p>E-mail: <b></b> info@osaarchivum.org</p>
                </div>
                <global-footer></global-footer>
            </main>
        `;
    }
}