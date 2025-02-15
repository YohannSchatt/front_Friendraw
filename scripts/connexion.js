import '../styles/connexion.css';
import '../styles/normal.css';
import '../styles/header.css';
import '../styles/footer.css';

import { load } from './main.js';
load();

const URL_BACK= 'fefe'

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('mdp');
const submitButton = document.getElementById('soumettre');

submitButton.addEventListener('click', verif_user);

function verif_user(event) {
    event.preventDefault();
    console.log("svhezrvhvjzh vjrv kerjvbzksh vkj vbvbajkvhzekjvbskvbsdv");
    fetch(`${URL_BACK}/user/connexion`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email" : emailInput.value, 
            "mdp" : passwordInput.value
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error()
        }
        return res.json()
    })
    .then(json => {
        if (json.success){
            localStorage.setItem('pseudo',json.pseudo);
            window.location.href = window.location.href.replace('/connexion.html', '/index.html');
        } else {
            alert('Erreur lors de la connexion à votre compte : Identifiant invalide');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur réseau : ", error);
    })
}