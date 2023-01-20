import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { WidgetWithStore } from './WidgetWithStore';
import "./GlobalMenu";

@customElement('community-guidelines')
export class CommunityGuidelines extends WidgetWithStore {
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
                <h1>Community Guidelines</h1>
                <p><b>Parallel Archive (PA)</b> is a global platform for scholars to upload, store, study and share their digitized archival sources. It is meant to be a community of many types of people with different backgrounds, views, and beliefs. In order for our users to feel comfortable and be able to enjoy proper content and interact in an atmosphere of trust and respect, here are some commonsense guidelines we would like you to be aware of and abide by.</p>
                
                <h4>Profile and Personal Information</h4>
                <p>Be considerate when choosing your username: do not pretend to be someone else (another member of the PA community, a PA staff or the representative of another established organization, or your neighbor's daughter); do not pick a username that is obscene or offensive. If we discover any of the aforementioned, we reserve the right to terminate your account. Once your account is terminated, you will not be allowed to create any new accounts on PA.</p>
                <p>We do not advise you to share your password with others.</p>
                <p>It is up to you what kind of personal information you provide in your profile, and whether you keep your profile information to yourself or make it public. In any case, remember that your professional integrity helps guarantee the quality of your uploaded documents and other community activities, so be proud of your academic status and institutional affiliations. However, if we find that you fill your profile with inappropriate (obscene or offensive) or nonsense information, we reserve the right to terminate your account.</p>
                <p>If you choose to make your profile public, do not upload an inappropriate profile photo. In case you do so, we reserve the right to remove that photo and/or terminate your account.</p>
                <p>Do not invade or abuse other people's privacy by publishing their personal information.</p>

                <h4>Uploading and Publishing Content</h4>
                <p>PA is as reliable and valuable as the content uploaded by its users. We expect you to upload meaningful archival resources that benefit the entire research community.</p>
                <p>We accept and encourage authentic documents on controversial subject matter, but we monitor the way these documents are described, tagged, commented on, and discussed in forums and make sure that the tone remains scholarly and appropriate.</p>
                <p>Do not litter the platform with nonsense, repetitive, or unwanted content and description. We reserve the right to delete:</p>
                <ul>
                    <li>documents that are described with inappropriate or nonsense metadata;</li>
                    <li>documents that do not fit our collection scope or are in any other way in violation of our <a href="collection-policy">Collection Policy</a> and <a href="terms-of-use">Terms of Use</a>, especially content that violates the privacy of others.</li>
                </ul>
                <p>We reserve the right to remove inappropriate tags.</p>
                <p>Private accounts are for scientific work and research purposes only, so do not use them for illegal or illicit activities. We reserve the right to monitor private workspaces for such purposes. If we find traces of any such activities, we will terminate your account.</p>

                <h4>Comments and Discussions</h4>
                <p>We encourage our users to engage in informed, intelligent, and passionate discussions, and will do everything to ensure that these debates are enjoyable for the entire PA community. We urge you to respect the views and beliefs of fellow community members. We will not tolerate racism, sexism, homophobia or any other form of hate-speech, as well as any communication that is obscene, libelous, or harmful. We reserve the right to remove any posting that can be interpreted as such by other users.</p>
                <p>PA is a platform solely meant for scientific and research purposes. We support vivid discussions on any variety of issues related to particular documents on PA, general research topics, or technical particularities of PA (also in comparison with other similar platforms.) We reserve the right to remove unrelated postings, particularly those that may be interpreted as commercial or spam-like.</p>
                <p>We may intervene in (initiate, join, terminate) discussions to help focus communication within PA and ensure that these forums remain inviting and inclusive for all our users. Our interventions will be clearly identified as PA Curator's moderation or interaction.</p>

                <h4>Report Violations</h4>
                <p>Share responsibility for building and maintaining a decent PA community by reporting inappropriate content or behavior. If you suspect that any activity on PA is in violation of the Terms of Use or the above Community Guidelines, please signal this by emailing the PA Curator <a href="mailto:support@parallelarchive.org">(support@parallelarchive.org)</a>. In justified cases, the Curator will modify or remove any such contribution.</p>
                <p>The Curator will register any misbehavior or inappropriate activity or contribution. Users who repeatedly and willfully breach the Community Guidelines and/or the <a href="terms-of-use">Terms of Use</a>, may have their PA account suspended or permanently removed.</p>

                <h4>Conclusion</h4>
                <p>We have drafted these guidelines to ensure that all PA community members have the necessary information that enables them to participate responsibly. It is important that you understand and respect these rules. If you do so, PA will be an intelligent, reliable, inclusive and safe platform.</p>

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
                        <a href="/collection_policy">Collection Policy</a>
                    </li>
                </ul>
                <p><i>Last edited June 2009.</i></p>
                <global-footer></global-footer>
            </main>
        `;
    }
}