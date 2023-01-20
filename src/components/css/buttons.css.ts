import { css } from "lit";
import { colorsCss } from "./colors.css";

export const buttonsCss = css`
    ${colorsCss}
    .button {
        font-family: inherit;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: var(--font-size-small);
        padding: 6px 14px;
        text-transform: capitalize;
        text-decoration: none;
        color: var(--color-primary-500);
    }

    .button[disabled].button-primary-500 {
        background-color: var(--color-grey-light);
        color: var(--color-grey);
        box-shadow: none;
    }
    .action-buttons .button[disabled].button-primary-500 {
        color: white;
        background-color: transparent;
    }

    .button-primary-300 {
        color: var(--color-white);
        background: var(--color-primary-300);
    }

    .button-primary-500 {
        color: var(--color-white);
        background: var(--color-primary-500);
    }

    .button-ghost-primary-500 {
        background: var(--color-white);
        border: 1px solid var(--color-primary-500);
        color: var(--color-primary-500);
    }

    .button-floating-primary-800 {
        background: var(--color-primary-800);
        border-radius: 100%;
        color: var(--color-white);
        cursor: pointer;
        height: var(--floating-button-size);
        width: var(--floating-button-size);
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 0.7rem;
    }
`;
