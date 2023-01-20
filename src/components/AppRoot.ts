import { html, css, LitElement } from 'lit'
import { generalCss } from './css/general.css'
import { colorsCss } from './css/colors.css'
import { customElement, property } from 'lit/decorators.js'
import { Params } from '../main.types'
import { routeNames } from '../router/routes'

import './GlobalMenu'
import './GlobalFooter'
import './UploadedImages'
import "./EditDocument";
import './PrivateDocuments';
import './ErrorSnackbar';
import './ImageView';
import "./UserManual";
import "./CollectionPolicy";
import "./CommunityGuidelines";
import "./ContactUs";
import "./CopyrightPolicy";
import './PrivacyPolicy';
import './TermsOfUse';
import "./FrequentlyAskedQuestions";
import { Tstore } from '../store/Store'
import { gotoParentPage } from '../utils/utils'

declare global {
    interface Window {
        umami?: any
    }
}

@customElement('app-root')
export class AppRoot extends LitElement {
    static styles = [
        colorsCss,
        generalCss,
        css`
            p { color: blue }
        `
    ];

    @property({ type: Object, attribute: false })
    route = {
        path: <routeNames>'',
        params: <Params>{}
    };

    @property({ type: Object, attribute: false })
    store: Tstore | null = null

    render() {
        return html`
            <error-snackbar></error-snackbar>
            ${this.route.path === '/404' ? html`<h1>404 Not Found</h1><a @click=${() => gotoParentPage('login')}>go to login page?</a>` : ''}
            ${this.route.path === '/' ? html`<div class="center-content home"><h1><a @click=${() => gotoParentPage('')}>Parallel Archive</a></h1></div>` : ''}
            ${this.route.path === '/uploadedimages/:id?' ? html`<uploaded-images></uploaded-images>` : ''}
            ${this.route.path === '/image/:id?' ? html`<image-view image-id=${this.route.params.id}></image-view>` : ''}
            ${this.route.path === '/edit-document/:id?' ? html`<edit-document document-id=${this.route.params.id}></edit-document>` : ''}
            ${this.route.path === '/privatedocuments' ? html`<private-documents></private-documents>` : ''}
            ${this.route.path === '/user_manual' ? html`<user-manual></user-manual>` : ''}
            ${this.route.path === '/collection_policy' ? html`<collection-policy></collection-policy>` : ''}
            ${this.route.path === '/community_guidelines' ? html`<community-guidelines></community-guidelines>` : ''}
            ${this.route.path === '/contact_us' ? html`<contact-us></contact-us>` : ''}
            ${this.route.path === '/copyright_policy' ? html`<copyright-policy></copyright-policy>` : ''}
            ${this.route.path === '/privacy_policy' ? html`<privacy-policy></privacy-policy>` : ''}
            ${this.route.path === '/terms_of_use' ? html`<terms-of-use></terms-of-use>` : ''}
            ${this.route.path === '/faq' ? html`<frequently-asked-questions></frequently-asked-questions>` : ''}
        `;
    }
}
