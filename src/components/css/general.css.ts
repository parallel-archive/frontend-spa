import { css } from "lit";

export const generalCss = css`

    :host {
        --font-size-base: 18px;
        --font-size-medium: 16px;
        --font-size-small: 14px;
        --font-size-xsmall: 14px;
        --font-size-tiny: 8px;
        --floating-button-size: 56px;

        --modal-width: 22rem;

        --shadow-s: 0px 0px 5px 0px rgba(0,0,0,0.15);
        --shadow-m: 0px 0px 10px 0px rgba(0,0,0,0.2);
        --shadow-l: 0px 0px 20px 0px rgba(0,0,0,0.25);

        --desktop-menu-full-width: 340px;
        --desktop-menu-slim-width: 280px;
        --desktop-secondary-menu-width: 240px;
        --desktop-menu-stacked-width: calc(var(--desktop-menu-slim-width) + var(--desktop-secondary-menu-width));
    }
    
    *, *:before, *:after {
        box-sizing: border-box;
    }

    .center-content {
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
    }
    .home a {
        color: var(--color-primary-500);
        display:flex;
        cursor: pointer;
        font-size: 10vw;
        padding-bottom: .05rem;
        border-bottom: .5rem solid var(--color-primary-500);
    }
    .main {
        max-width: 960px;
        margin: 0 auto;
        padding: 1.5rem 0;
        padding-bottom:10rem;
        position: relative;
    }
    .mr-1 {
        margin-right: 0.5rem;
    }
    .flex-row {
        display: flex;
        align-items:center;
    }

    .full-width{
        width:100%;
    }
    .loading {
        display: flex;
        height: 5rem;
        margin: 0 auto;
        width: 5rem;
        transform: none;
    }

    .loading:after {
        content: " ";
        display: block;
        width: 4rem;
        height: 4rem;
        margin: .5rem;
        border-radius: 50%;
        border: .2rem solid var(--color-primary-500);
        border-color: var(--color-primary-500) transparent;
        animation: spin 1.2s linear infinite;
    }

    @keyframes spin {
        100% {
            transform:rotate(360deg);
        }
    }
    .watermark {
        display: none;
    }
    @media (min-width:1024px) {
        .watermark {
            position: fixed;
            color: #ececec;
            font-weight: 900;
            font-size: 9rem;
            left: var(--desktop-menu-stacked-width);
            top:0;
            line-height:1;
            display:block;
            z-index:0;
        }

    }

    .fancy-scroll::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    }
    .fancy-scroll::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
    }
    .fancy-scroll::-webkit-scrollbar-thumb {
    background: #fe9790;
    border: 0px none #ffffff;
    }
    .fancy-scroll::-webkit-scrollbar-thumb:hover {
    background: #ffb8b3;
    }
    .fancy-scroll::-webkit-scrollbar-thumb:active {
    background: #000000;
    }
    .fancy-scroll::-webkit-scrollbar-track {
    background: #dd382d;
    border: 0px none #ffffff;
    border-radius: 0px;
    }
    .fancy-scroll::-webkit-scrollbar-track:hover {
    background: #dd382d;
    }
    .fancy-scroll::-webkit-scrollbar-track:active {
    background: #dd382d;
    }
    .fancy-scroll::-webkit-scrollbar-corner {
    background: transparent;
    }
`