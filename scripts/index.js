import * as verif from './verif_connexion.js';

const URL_FRONT= import.meta.env.VITE_URL_FRONT

export function index() {
    const button_Alldraw = document.getElementById("Alldraw_button");
    titre.addEventListener('click', () => {
        window.location.href=`${URL_FRONT}/index.html`
    })
    const button_dessin = document.getElementById("Dessin");
    titre.addEventListener('click', () => {
        window.location.href=`${URL_FRONT}/index.html`
    })
    verif.Logged
    .then(Logged => {
        if (Logged) {
            console.log("test")
            document.getElementById('Dessin').remove()
        }
    })
}