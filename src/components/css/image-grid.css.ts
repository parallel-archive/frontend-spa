import {css} from 'lit'

export const imageGrid = css`
.image-grid {
    display: grid;
    /* grid-template-columns: 1fr 1fr; */
    gap: 1rem;
    width: 100%;
    padding:0 1rem;

}
@media (min-width: 480px){
    .image-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
}
.image-card {
    cursor: pointer;
    position:relative;
    display: flex;
    overflow:hidden;
    background-color: white;
    border:1px solid var(--color-grey-light);
    border-radius:3px;
}

.image-card .select-checkbox {
    position:absolute;
    padding:0.5rem;
    top:0;
    right:0;
}
.image-card .select-checkbox input{
    transition: opacity 0.3s;
}
.image-card .select-checkbox input:not(:checked){
    transition: opacity 0.3s;
}

.image-card__clickable-area {
    display: flex;
    width: calc(100% - 18px - 1rem);
}

.image-card .image-container {
    margin:1rem;
    display: flex;
    justify-content: center;
    width: 150px;
}


.image-card img {
    display: inline-block;
    height: 150px;
    object-fit: cover;
}
.image-card__info {
    margin:1rem;
    margin-left:0;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    font-weight:500;
    min-width:30%;
}
.image-card__info_name {
    text-transform: uppercase;
    color: var(--color-primary-400);
    font-size:0.8rem;
    margin: auto 0;
    overflow:hidden;
    text-overflow:ellipsis;
}
.image-card__date span{
    display: block;
}
.image-card__date-added {
    color: var(--color-primary-400);
}

`