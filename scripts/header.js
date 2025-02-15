
import * as verif from './verif_connexion.js';

    // Modifier le menu en fonction du statut de connexion
export function header() {
    const menu = document.getElementById("right_header");
    const titre = document.getElementById("titre_header");
    titre.addEventListener('click', () => {
        window.location.href=`${window.location.origin}/index.html`
    })
    verif.Logged
    .then(isLoggedIn => {
        if (isLoggedIn) {
            const myDraw = document.createElement('button');
            myDraw.innerText = 'MyDraw';
            myDraw.className = "Button_CI";
            myDraw.onclick = myDraw_click;
            menu.appendChild(myDraw);
    
            const AllDraw = document.createElement('button');
            AllDraw.innerText = 'AllDraw';
            AllDraw.className = "Button_CI";
            AllDraw.onclick = AllDraw_click
            menu.appendChild(AllDraw);
        } else {
            throw new Error()
        }        
    })
    .catch(error => {
        const connexion = document.createElement('button');
        connexion.innerText = 'Connexion';
        connexion.className = "Button_CI"
        connexion.onclick = connexion_click;
        menu.appendChild(connexion);

        const inscription = document.createElement('button');
        inscription.innerText = 'Inscription';
        inscription.className = "Button_CI"
        inscription.onclick = inscription_click;
        menu.appendChild(inscription);
    })
};

function connexion_click(){
    window.location.href=(`${window.location.origin}/pages/connexion.html`);
}

function inscription_click(){
    window.location.href=`${window.location.origin}/pages/inscription.html`;
}

function myDraw_click(){
    window.location.href=`${window.location.origin}/pages/mydraw.html`;
}

function AllDraw_click(){
    window.location.href=`${window.location.origin}/pages/AllDraw.html`;
}