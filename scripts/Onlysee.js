import '../styles/OnlySee.css';
import '../styles/normal.css';
import '../styles/header.css';
import '../styles/footer.css';

import { load } from './main.js';
load();

const URL_BACK= 'sfsfesfs'

const canvas = document.getElementById("canvas"); //récupère le canvas
const ctx = canvas.getContext("2d"); //défini comment on utilise le canvas

canvas.addEventListener('load', init_dessin())

function init_dessin() {
    const nom = localStorage.getItem('dessin_OnlySee');
    recup_image(nom);
}

function recup_image(nom){
    fetch(`${URL_BACK}/user/dessin/select`,{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nom: nom
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Vous n'êtes pas connecté");
        }
    })
    .then(data => {
        if (data.authorization) {
            var img = new Image()
            img.src = `data:image/png;base64,${data.image}`;
            ctx.drawImage(img,0,0,img.width,img.height);
        }
        else {
            alert("Erreur lors de la déconnexion");
        }
    })
}