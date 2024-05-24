import * as verif from './verif_connexion.js';


export function index() {
    const button_Alldraw = document.getElementById("Alldraw_button");
    titre.addEventListener('click', () => {
        window.location.href=`${window.location.origin}/index.html`
    })
    const button_dessin = document.getElementById("Dessin");
    titre.addEventListener('click', () => {
        window.location.href=`${window.location.origin}/index.html`
    })
    verif.Logged
    .then(Logged => {
        if (Logged) {
            console.log("test")
            document.getElementById('Dessin').remove()
        }
    })
}