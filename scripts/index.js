import '../styles/index.css';
import '../styles/normal.css';
import '../styles/header.css';
import '../styles/footer.css';

import * as verif from './verif_connexion.js';
import { header } from './header.js';
window.onload = function () {
    header();
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