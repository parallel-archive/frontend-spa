import {html, css } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { gotoParentPage } from '../utils/utils';
import { generalCss } from "./css/general.css";
import { WidgetWithStore } from './WidgetWithStore';
import { StoreEvent } from '../store/Store.types';

@customElement('global-menu')
export class GlobalMenu extends WidgetWithStore {
    static styles = [
        generalCss,
        css`
        /* SMALL SCREEN */
        :host {
            display: block;
            position: sticky;
            top: 0;
            z-index: 4;
        }

        .backdrop[data-drawer-open="true"] {
            background: #dddddd63;
            bottom: 0px;
            display: block;
            height: 100%;
            position: fixed;
            right: 0px;
            top: 0px;
            z-index: 3;
            width: 100%;
        }
        .menu {
            background: var(--color-primary-800);
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 4rem auto;
            height: 3.5rem;
            justify-content: start;
            grid-template-rows: repeat(1, 1fr);
        }
        .menu-user-block {
            position: absolute;
            width:100%;
            bottom:1rem;
        }
        .menu-user-block a {
            border-bottom:none !important;
        }
        

        .menu[data-document-edit="true"] {
            z-index: 3;
        }

        .menu-items {
            max-width: 100%;
            overflow-x: hidden;
            font-size: 20px;
        }

        .menu-items a {
            color: white;
            display: block;
            text-decoration: none;
            border-bottom: 2px solid transparent;
            padding: 1.5em;
            padding-left:0;
            margin-left:1.5rem;
            padding-bottom:0.5rem;
            cursor: pointer;
            overflow: hidden;
            text-overflow:ellipsis;
            transition: all 0.3s ease;
        }
        .menu-items a:hover:not([data-selected="true"]) {
            margin-left:2rem;
            border-bottom:2px solid rgba(255,255,255,0.5);
            font-weight: bold;
        }


        .menu-items a[data-selected="true"] {
            border-color: white;
            font-weight: bold;
        }

        .hamburger {
            align-items: center;
            box-sizing: border-box;
            display: grid;
            grid-auto-flow: row;
            padding: .9rem;
        }

        .hamburger span {
            background: white;
            display: block;
            height: 3px;
            width: 100%;
        }

        .navigation-content {
            background: var(--color-primary-800);
            color: white;
            bottom: 0;
            display: grid;
            grid-auto-flow: row;
            grid-template-rows: repeat(2, min-content);
            position: fixed;
            transition: .3s;
            top: 0;
            width: 100vw;
            z-index: 4;
        }

        .navigation-content[data-drawer-open="false"] {
            transform: translateX(-100%);
        }

        .navigation-content[data-drawer-open="true"] {
            transform: translateX(0%);
        }

        .navigation-content .user-menu {
            display: grid;
            grid-template-rows: repeat(2, 1fr);
        }

        .user-mobile {
            border-bottom: 1px solid var(--color-grey-light);
            overflow: hidden;
            padding: 2.5rem 1rem 2rem;
            text-overflow: ellipsis;
            max-width: 75vw;
            white-space: nowrap;
        }

        .user-mobile {
            color: var(--color-black);
            text-decoration: underline;
            text-decoration-color: transparent;
        }

        .user-menu {
            border-top: 1px solid var(--color-grey-light);
        }

        .user-desktop {
            display: none;
        }

        .document-header {
            color: var(--color-white);
            display: none;
        }

        [data-document-edit="true"] .menu-items {
            display: grid
        }

        [data-document-edit="true"] .document-header {
            align-items: center;
            cursor: pointer;
            display: grid;
            font-size: var(--font-size-base);
            justify-content: start;
            grid-template-columns: 1fr;
            width: calc(100vw - 4rem - 0.7rem);
        }

        [data-document-edit="true"] .document-header .flex-row {
            align-items: baseline;
            overflow: hidden;
        }

        [data-document-edit="true"] .document-header.desktop {
            display: none;
        }

        .edit-document {
            background: transparent;
            border: none;
            color: var(--color-white);
            font-size: var(--font-size-small);
            font-weight: 900;
        }

        .mr-1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            width: 100%;
        }

        /* LARGE SCREEN */
        .mobile-menu-close {
            position:absolute;
            top:1rem;
            right:1rem;
            width:2rem;
            height:2rem;
            background-color:white;
            -webkit-mask: url('/static/x-circle.svg') no-repeat center;
            mask: url('/static/x-circle.svg') no-repeat center;
        }
        @media(min-width: 1024px) {
            .mobile-menu-close {
                display:none;
            }
            .hamburger,
            .backdrop[data-drawer-open="true"] {
                display: none;
            }
            
            .menu {
                box-sizing: border-box;
                display: block;
                position: fixed;
                top:0;
                bottom:0;
                width: var(--desktop-menu-full-width);
                height: unset;
            }

            .menu.slim {
                width: var(--desktop-menu-slim-width);
            }
            
            .menu .navigation-content {
                background: transparent;
                padding: 0;
                position: static;
                transform: none;
                transition: none;
                width: 100%;
            }

            .menu .user-menu {
                border-top: none;
                grid-template-rows: unset;
                padding: 0;
            }

            .user-mobile {
                display: none;
            }

            .user-desktop {
                display: block;
                padding: 1rem 0;
            }

            [data-document-edit="true"] .document-header.desktop {
                display: grid;
                justify-content: start;
                padding-left: 20%;
            }
            [data-document-edit="true"] .document-header.mobile {
                display:none;
            }

        }

        .mobile-header {
            position: absolute;
            color:white;
            font-weight:normal;
            left:4rem;
            top:0.6rem;
            margin:0;
        }
        @media (min-width:1024px){
            .mobile-header {
                display:none;
            }
        }
        .user-icon {
            color:white;
            aspect-ratio:1;
            display:inline-block;
            height:1.2em;
            position:relative;
            top:0.25em;
            margin-right:0.5em;
        }
      `
    ];

    @property({type: Boolean, attribute: "slim"})
    slim = false

    @property({type: String, attribute: "user"})
    user = ""

    @state()
    userMenuOpen = false

    @state()
    drawerMenuOpen = false

    @property({type: String, attribute: "document-name"})
    documentName = "Untitled Document"

    @state()
    myShoeBoxSize: null | number = null

    @state()
    documentsSize: null | number = null

    constructor() {
        super();
        this.documentName = "Untitled Document"
        this.store.getMenuItemCount().then(() => {
            this.myShoeBoxSize = this.store.menuItemSize.myShoeBoxSize
            this.documentsSize = this.store.menuItemSize.documentsSize
        });
    }

    get onDocumentEdit() {
        return window.location.pathname.includes("/edit-document");
    }

    getSelected(path: string) {
        return path == window.location.pathname
    }

    openDrawerMenu() {
        this.drawerMenuOpen = true;
        document.body?.setAttribute("data-overlay-open", "data-overlay-open");
    }

    closeDrawerMenu(e:Event) {
        e.stopPropagation()
        if (this.drawerMenuOpen) {
            this.drawerMenuOpen = false;
            document.body?.removeAttribute("data-overlay-open");
        }
    }

    openUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    logout(e: Event) {
        e.preventDefault()
        this.store.logout()
        gotoParentPage('')
    }

    documentHeaderClick() {
        this.sendEvent("document-header-click", {});
    }

    updated() {
        this.store.addEventListener(StoreEvent.update, (e) => {
            if((e as CustomEvent).detail === 'menuItemSize') {
                this.myShoeBoxSize = this.store.menuItemSize.myShoeBoxSize
                this.documentsSize = this.store.menuItemSize.documentsSize
            }
        });
    }

    render() {
        return html`
            <div class="menu ${this.slim ? 'slim' : ''}" data-document-edit=${this.onDocumentEdit}>
                <div class="hamburger"
                    @click=${this.openDrawerMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <h1 class="mobile-header">${this.title}</h1>
                ${this.onDocumentEdit ? html`<div class="document-header mobile" @click=${this.documentHeaderClick}>
                    <div class="flex-row">
                        <div class="mr-1">${this.documentName}</div>
                        ${this.documentName? html`<button class="button edit-document">Edit</button>` : ''}
                    </div>
                </div>` : ""}
                <div class="navigation-content" data-drawer-open=${this.drawerMenuOpen}>
                    <a @click=${this.closeDrawerMenu}>
                        <img class="mobile-menu-close"/>
                    </a>

                    <div class="menu-items">
                        <a
                            @click=${() => gotoParentPage("")}
                            data-selected=${this.getSelected("/")}>Public Documents
                        </a>
                        <a href="/uploadedimages"
                            data-selected=${this.getSelected("/uploadedimages")}
                            >Uploaded Images
                                ${this.myShoeBoxSize != null ? html`<span>(${this.myShoeBoxSize})</span>` : ""}
                        </a>
                        <a href="/privatedocuments"
                            data-selected=${this.getSelected("/privatedocuments")}
                            >Private Documents
                            ${this.myShoeBoxSize != null ? html`<span>(${this.documentsSize})</span>` : ""}
                        </a>
                        <a
                            @click=${() => gotoParentPage("privatecollections/mydocuments")}
                            data-selected=${this.getSelected("/privatecollections/mydocuments")}>Private Collections
                        </a>
                        <div class="menu-user-block">
                            <a @click=${() => gotoParentPage("changepassword")}
                                data-selected=${this.getSelected("/changepassword")}>
                                <svg class="user-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                My Account</a>
                        </div>
                    </div>
                </div>

                <div class="backdrop" data-drawer-open=${this.drawerMenuOpen}></div>
            </div>
        `;
    }
}