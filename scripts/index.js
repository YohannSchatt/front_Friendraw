import * as verif from '../utils/verif_connexion.js';
import { load } from '../utils/main.js';
window.onload = function () {
    load();
    index();
};

function index() {
    const button_Alldraw = document.getElementById("Alldraw_button");
    button_Alldraw.addEventListener('click', () => {
        window.location.href=`${window.location.origin}/AllDraw.html`
    })
    const button_dessin = document.getElementById("Dessin");
    button_dessin.addEventListener('click', () => {
        window.location.href=`${window.location.origin}/dessin.html`
    })
    verif.Logged
    .then(Logged => {
        if (Logged) {
            console.log("test")
            document.getElementById('Dessin').remove()
        }
    })
}