const URL_FRONT= import.meta.env.VITE_URL_FRONT
const URL_BACK= import.meta.env.VITE_URL_BACK

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('mdp');
const submitButton = document.getElementById('Submit');

function verif_user() {
    event.preventDefault();
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
            window.location.href = `${URL_FRONT}/index.html`;
        } else {
            alert('Erreur lors de la connexion à votre compte : Identifiant invalide');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur réseau : ", error);
    })
}