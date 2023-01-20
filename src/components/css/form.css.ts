import { css } from "lit";
import { colorsCss } from "./colors.css"

export const formCss = css`
    ${colorsCss}
    label {
        display: block;
        margin-bottom: .2rem;
    }

    input {
        display:block;
        margin: 0 0 1rem 0;
        padding: 5px;
    }

    input, textarea {
        font-family:inherit;
        font-size: inherit;
    }

    textarea {
        resize: none;
    }

    button[type="submit"],
    input[type="submit"] {
        cursor: pointer;
        margin: 1rem 0;
    }

    label.styled-input-label {
        background: white;
        box-sizing: border-box;
        color: var(--color-grey);
        display: inline-block;
        font-size: var(--font-size-xsmall);
        left: .8rem;
        padding: 0 .3rem;
        position: relative;
        top: .8rem;
        width: fit-content;
    }

    textarea.styled-input,
    input.styled-input {
        border: 1px solid var(--color-grey-light);
        border-radius: 4px;
        box-sizing: border-box;
        color: var(--color-grey);
        margin-bottom: 10px;
        margin-bottom: 10px;
        padding: 16px;
        width: 100%;
    }

    input.styled-input:active,
    input.styled-input:focus,
    textarea.styled-input:active,
    textarea.styled-input:focus {
        border: 1px solid var(--color-primary-500);
        color: 1px solid var(--color-black);
        margin-bottom: 10px;
        outline: none;
    }

    .select-checkbox {
        position:absolute;
        padding:0.5rem;
        top:0;
        right:0;
    }
    .select-checkbox input{
        border-width:1px;
        transition: opacity 0.3s;
    }
    .select-checkbox input:not(:checked){
        transition: opacity 0.3s;
    }

    .form-error {
        color: var(--color-error);
        margin: .5rem 0;
    }

    select {
        cursor:pointer;
        padding:0.3rem;
        border:none;
        background-color:white;
        display:inline-block;
        font-family:inherit;
        font-size: inherit;
    }

    input[type="checkbox"] {
        appearance:none;
        border: 2px solid #b5afaf;
        width: 20px;
        height: 20px;
        cursor:pointer;
        position:relative;
        margin:0;
        padding: 7px;
    }
    input[type="checkbox"]:checked::before{
        content:url('/static/check.svg');
        position:absolute;
        width:100%;
        top:0;
        left:0;
        line-height:0;
    }
    input[type="checkbox"]:checked {
        border-color: var(--color-primary-500);
        background-color: var(--color-primary-500);
    }

    input[type="checkbox"].radio-like-checkbox {
        border-radius: 11px;
    }

    button {
        font-family:inherit;
    }
`
