import { css } from 'lit'

export const previewCss = css`
    .preview {
        position:fixed;
        inset:0;
        z-index:4;
        background-color:white;
    }
    .preview-box {
        position:fixed;
        inset:0;
        display:flex;
        flex-direction:column;
    }

    .preview-image-box {
        width:100%;
        height:100%;
        position: relative;
        resize: vertical;
        overflow:auto;

    }
    
    .preview img {
        display:block;
    }
    .preview-scroll {
        width:100%;
        height:100%;
        display:grid;
        place-items:center;
    }

    

    .preview-scroll img {
        margin-top:4rem;
    }
    .preview-scroll img.horizontal {
        width:100%;
        max-width:1440px;
    }
    .preview-scroll img.vertical {
        height:calc(100vh - 4rem);
    }
    .preview-scroll img.x2 {
        transform:scale(2);
        transform-origin: top left;
    }
    .preview-controls {
        position:sticky;
        margin-bottom:-3rem;
        overflow:show;
        top:1rem;
        left:0;
        display:flex;
        justify-content:flex-end;
        margin-right:1rem;
        z-index:1;
    }
    .preview-controls .mode-active {
        outline:1px solid var(--color-primary-500);
    }
    .preview-controls button {
        margin:0 0.25rem;
    }
    .preview-ghost-button {
        border: 1px solid var(--color-primary-500);
    }
    .preview__vertical-fit-icon, .preview__horizontal-fit-icon {
        background-color: var(--color-primary-500);
        -webkit-mask: url('/static/fit-horizontal.svg') no-repeat center;
        mask: url('/static/fit-horizontal.svg') no-repeat center;
    }
    .preview__vertical-fit-icon {
        transform:rotate(90deg);
    }

    .ocr-in-preview-container {
        padding: 1rem;
        display: flex;
        flex:1;
        flex-direction:column;
        justify-content:stretch;
        background-color:var(--color-bg-grey);
    }
    .ocr-in-preview-header {
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-bottom:1rem;
    }
    .ocr-in-preview-header > * {
        margin:0;
    }
    .ocr-in-preview-container h3 {
        color: var(--color-primary-400);
    }
    .ocr-in-preview-container textarea {
        min-width:25vw;
        width:100%;
        height:100%;
        min-height:150px;
        padding:1rem;
        border:none;
        background-color:rgba(255,255,255,0.3);
    }

    @media screen and (orientation:landscape){
        .preview-box {
            flex-direction: row;
        }
        .preview-image-box {
            resize: horizontal;
        }
    }
`