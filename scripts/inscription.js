import '../styles/inscription.css';
import '../styles/normal.css';
import '../styles/header.css';
import '../styles/footer.css';

import { load } from './main.js';
load();

const URL_BACK= 'ffsfesfs'

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('mdp');
const pseudoInput = document.getElementById('pseudo');
const submitButton = document.getElementById('Submit');

function ajout_user(){
    event.preventDefault();
    console.log(emailInput.value);
    fetch(`${URL_BACK}/user/inscription`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "pseudo": pseudoInput.value,
            "mdp":  passwordInput.value,
            "email": emailInput.value
        })
    }) 
    .then(res => {
        if (!res.ok) {
            throw new Error('Erreur réseau');
        }
        return res.text();
    })
    .then(message => {
        if (message.trim() === "success") {
            window.location.href = `${window.location.origin}/pages/connexion.html`;
        } else {
            alert('Erreur lors de la création du compte : ' + message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur réseau : ", error);
    });
}