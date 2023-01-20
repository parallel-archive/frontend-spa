import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";

@customElement('collection-policy')
export class CollectionPolicy extends WidgetWithStore {
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
                <h1>Collection Policy</h1>
                <p><b>Parallel Archive (PA)</b> collects digitized <b>archival documents</b> from around the world.</p>

                <h4>Source</h4>
                <p>PA currently accepts documents that are located in the collections of archives, special libraries, research and documentation centers, and other institutions and organizations. Personal and family papers may be accepted on a case by case basis.</p>

                <h4>Type and Content</h4>
                <p>Archival documents are considered sources of permanent historical value: written or visual testimonies of the past. They are generally, but not always, non-published. They may include original documents and creative works, such as:</p>
                <ul>
                    <li>government, church, and business records;</li>
                    <li>literary typescripts and manuscripts;</li>
                    <li>unpublished autobiographies, diaries, and letters;</li>
                    <li>unpublished photos, prints, drawings, and musical scores;</li>
                    <li>unpublished maps and plans;</li>
                    <li>drafts of published works;</li>
                    <li>annotated publications;</li>
                    <li>underground literature, gray literature, and printed ephemera.</li>
                </ul>
                <p>Please do not upload published or unpublished papers into the public PA Repository. If it is relevant to existing discussions, however, you can attach them to your postings in forum discussions.</p>

                <h4>Accepted Formats and Quality</h4>
                <p>The system currently accepts digitized text and image documents. The accepted file formats are: TIFF, JPEG/JPEG 2000, PDF, BMP, PCX, DCX, PNG, and DjVu. When scanning documents for upload, it is recommended to use the highest possible quality. The higher the resolution of the uploaded material, the better the OCR results. The minimum suggested resolution is 200 dpi for texts and 300 dpi for images in TIFF and JPEG file formats.
                <br>If digitized texts are not readable, please do not upload them. Similarly, please do not upload blurred, unusable pictures.</p>

                <h4>Languages</h4>
                <p>PA accepts documents in any language and alphabet. PA's OCR software recognizes most languages and alphabets. The results are best for major European languages.</p>

                <h4>Metadata</h4>
                <p>Please fill out the descriptive metadata fields as fully and completely as possible according to the guidance provided on the page. English is strongly encouraged for all fields except Original Title. Required fields must be filled out.</p>

                <h4>Warning</h4>
                <p>We reserve the right to delete public documents that are not deemed to be of permanent historical value or otherwise fall outside the scope of this Collection Policy or violate the <a href="/terms_of_use">Terms of Use</a>. Public documents violating privacy or copyright will also be deleted. Illegal documents will be deleted, even if they have been kept private. Please see the <a href="/community_guidelines">Community Guidelines</a> for further information.</p>

                <p>Please also read our:</p>
                <ul>
                    <li>
                        <a href="/terms_of_use">Terms of Use</a>
                    </li>
                    <li>
                        <a href="/privacy_policy">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/copyright_policy">Copyright Policy</a>
                    </li>
                    <li>
                        <a href="/community_guidelines">Community Guidelines</a>
                    </li>
                </ul>
                <p><i>Last edited June 2009.</i></p>
                <global-footer></global-footer>
            </main>
        `;
    }
}