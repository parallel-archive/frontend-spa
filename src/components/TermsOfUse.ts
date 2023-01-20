import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";
import "./GlobalFooter";

@customElement('terms-of-use')
export class TermsOfUse extends WidgetWithStore {
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
                <h1>Terms of Use</h1>
                <p><b>Parallel Archive (PA)</b> is a not-for-profit, freely available, internet-based service. PA is available for all users, however, its services are intended solely for research and educational purposes.</p>
                <p>The use of PA is governed by these Terms of Use and the related policies of PA which are available on this website. Users may only use PA under the conditions described in these policies, they must accept the provisions of these policies.</p>
                <p>Anyone can use PA, however, certain services are available only for registered users. Searching, reading and downloading of information in PA is available for non-registered users, too. Other services, such as uploading, downloading, annotating, collecting, commenting or tagging documents, entering and editing metadata, sorting and organizing files and folders, or creating and editing user profiles, participating in forum discussions are reserved only for registered users.</p>
                <p>Registered users who upload documents can opt for the temporary restricting of public access to these documents up to two years. Such restricted documents are available only for those who uploaded them. On request by the registered user, his/her registration can be terminated. Uploaded information and documents, however, will not be removed from the publicly available space for reasons of terminating the user's registration. (For special cases of removing information, see below and also our Privacy Policy and Copyright Policy.) More detailed description of the available services and options can be found on our <a href="/faq">FAQ</a> page.</p>
                <p>PA is based on the concept of the Institute of Record, a charitable organization registered in Hungary, and maintained by OSA Archivum at Central European University (OSA). Technically, PA has been developed by <a href="http://www.itent.hu/">Itent Informatikai Kft.</a> and is being hosted by the <a href="http://www.ceu.hu/">Central European University</a> in Budapest, Hungary.</p>
                <p>OSA will do its best to maintain the service for the long run, including the preservation of the digital content uploaded by its users. OSA will ensure the necessary HW and SW and the functional and technical developing and expanding of the service. However, OSA cannot be held responsible for any damage or loss etc. resulting from the temporary unavailability or the termination of the service.</p>
                <p>By maintaining PA, OSA provides a collaborative tool for researchers and other users, however, OSA is not responsible for the authenticity, completeness and accuracy of the documents uploaded by the users of PA, nor for the content of any comments or other information posted by the users of PA. Therefore OSA is not responsible for any damage to third persons resulting from documents and information uploaded or posted by its users.</p>
                <p>Users of PA declare that they observe all legal and ethical rules that are applicable to their use of PA. Users are aware that legal rules may be differing in different countries or regions, and due to the nature of the internet, their activities during the use of PA may be subject to various jurisdictions.</p>
                <p>OSA does not intend to control, or interfere with, the activities of the users of PA, however, OSA reserves the right to moderate discussions or other forms of public exchange of information among users of PA in order to avoid misuse of the system, such as marketing or spamming, or breach of copyright or privacy rules.</p>
                <p>OSA does not alter the content of uploaded documents, comments or other information, but in case of serious or repeated breach of legal or ethical rules, it may remove documents and information in any form, or terminate the account of users. In such cases OSA will notify the users concerned accordingly.</p>
                <p>OSA will try to resolve any disputes between OSA and the users of PA through negotiations. In case if these negotiations prove to be unsuccessful, legal disputes are governed by Hungarian law. In such cases OSA stipulates the Central District Court of Pest as court of competent jurisdiction.</p>
                <p>OSA may make changes to these Terms of Use. OSA will call the attention of users of PA to any modification in its policies by posting a comment, and also by indicating the date of last modification of its policies.</p>

                <p>Please also read our:</p>
                <ul>
                    <li>
                        <a href="/privacy_policy">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/copyright_policy">Copyright Policy</a>
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