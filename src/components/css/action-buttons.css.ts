import { css } from "lit";

export const actionButtonsCss = css`
    .action-buttons {
        align-items: flex-start;
        background-color: var(--color-primary-400);
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        margin: 0 auto;
        max-width: 100%;
        padding: 0;
        position: sticky;
        top: 3.5rem;
        z-index: 3;
    }
    @media (max-width:1024px){

        .action-buttons :is(button, a, .button-floating-primary-800) {
            font-weight:900;
        }
        .action-buttons :is(button, a, .button-floating-primary-800):disabled {
            font-weight:100;
        }
    }
    .action-buttons .action-buttons__navigation{
        display:none;
    }
    .action-buttons button, .action-buttons .button-floating-primary-800 {
        position: unset;
        width:unset;
        height:unset;
        border-radius:unset;
        padding: 0.7rem;
        
    }
    .action-buttons .icon {
        float:right;
        aspect-ratio:1;
        position:relative;
        top:0.1em;
        height:1em;
        display: none;
    }
    .action-buttons .icon-bigger {
        height:1.3em;
        top:unset;
        left:0.2em;
    }
    @media(min-width: 1024px) {
        .action-buttons .icon {
            display:block;
        }
        .action-buttons {
            border-left:1px solid var(--color-primary-100);
            flex-direction: column;
            justify-content: start;
            position:fixed;
            left: var(--desktop-menu-slim-width);
            background-color: var(--color-primary-400);
            top:0;
            bottom:0;
            width: var(--desktop-secondary-menu-width);
            height:unset;
            margin:0;
        }
        
        .action-buttons .manage-document-buttons {
            display:block;
        }
        .action-buttons button, .action-buttons a, .action-buttons .button-floating-primary-800 {
            width:unset;
            height:auto;
            display: block;
            background-color:unset;
            color:white;
            font-weight: 100;
            font-size:1rem;
            padding: 1.5em 1em 0.5rem;
            font-family: inherit;
            border-bottom: 1px solid white;
            width:calc(100% - 2em);
            border-radius:0;
            margin:0 auto;
            text-align:left;
            transition: all 0.3s ease;
        }
        .action-buttons button:hover:not(:disabled),
        .action-buttons a:hover:not(:disabled), 
        .action-buttons .button-floating-primary-800:hover:not(:disabled) {
            font-weight: bold;
            padding-left: 1.5em;
        }
        .action-buttons button:first-child {
            margin-top: 0.5em;
        }

        .action-buttons :is(button, a, .button-floating-primary-800):first-child {
            background-color: white;
            color: var(--color-primary-400);
            padding-bottom:1rem;
            padding-top:1rem;
            padding-block: 0.7rem;
            margin-top:1.5rem;
            font-weight:normal;
        }
        .action-buttons :is(button, a, .button-floating-primary-800):first-child:hover {
            padding-left:1rem;
            box-shadow: 0px 4px 10px 0px rgba(153,0,0,0.5);

        }
    }
`;
