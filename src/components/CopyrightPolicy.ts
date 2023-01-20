import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";

@customElement('copyright-policy')
export class CopyrigtPolicy extends WidgetWithStore {
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
                <h1>Copyright Policy</h1>
                <p>OSA respects intellectual property rights and copyrights relating to documents uploaded to Parallel Archive (PA). Under the Terms of Use, PA can be used solely for research and educational purposes. In several jurisdictions such purposes fall under the category of Fair Use that constitute an exception from copyrights and intellectual rights restrictions.</p>
                <p>It is the user's responsibility to use documents in PA according to the terms described in the Terms of Use. OSA Archivum (OSA) is not controlling or monitoring such uses, nor is it responsible for any damage resulting from the use of documents uploaded and stored in PA.</p>
                <p>In case if a person or organization who has intellectual rights or copyrights in or in respect of the information and documents uploaded to the PA system requests so, OSA will remove these data and documents from the publicly available domain of PA. OSA will not judge the justifiedness of such requests.</p>

                <p>Please also read our:</p>
                <ul>
                    <li>
                        <a href="/terms_of_use">Terms of Use</a>
                    </li>
                    <li>
                        <a href="/privacy_policy">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/collection_policy">Collection Policy</a>
                    </li>
                    <li>
                        <a href="/community_guidelines">Community Guidelines</a>
                    </li>
                </ul>
                <p><i>Last edited October 2008.</i></p>
                <global-footer></global-footer>
            </main>
        `;
    }
}