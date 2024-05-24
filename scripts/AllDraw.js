import * as verif from './verif_connexion.js';

const URL_FRONT= import.meta.env.VITE_URL_FRONT
const URL_BACK= import.meta.env.VITE_URL_BACK
const URL_WS = import.meta.env.VITE_URL_BACK;

const dessin = document.getElementById("dessin");
var eltASignaler = null;

export function AllDraw() {
    document.getElementById('overlay_signalement').style.display='none';
    verif.Logged
        .then(Logged => {
            if (Logged) {
                UserPublicDessin();
            }
            else {
                document.getElementById('DivOnlyLike').style.display='none';
                InvitePublicDessin();
            }
        })
    document.getElementById('EnvoyerSignalement').onclick=EnvoieSignalement;
    document.getElementById('annulerSignalement').onclick=AnnulerSignalement;
    document.getElementById('Rechercher').onclick=rafraichir;

    //--------------------------------Web Socket---------------------------------------

    const socket = new WebSocket(URL_ws);

    socket.onopen = (event) => {
        console.log('Connected to the WebSocket server');
    };

    // Écoute des messages du serveur
    socket.onmessage = (event) => {
        console.log("C'est ca ?");
        const data = JSON.parse(event.data)
        console.log(`like reçu`);
        if(data.type === 'updateLikes') {
            MAJLike(data);
        }
        if(data.type === 'updateNomDessin'){
            MAJId(data);
        }
    };

    // Écoute de l'événement de fermeture
    socket.onclose = (event) => {
      console.log('Disconnected from the WebSocket server');
    };

    // Écoute des erreurs
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log(error.target);
    };

    //Quand on ferme/change la page
    window.addEventListener('unload', () => {
    if (socket) {
        socket.close(); // Ferme la connexion WebSocket
    }
    });
}

function rafraichir() {
    const div = document.getElementById('liste_dessin');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    AllDraw();
}

function InvitePublicDessin(){
    const pseudo = document.getElementById('pseudo_input');
    const nom = document.getElementById('nom_dessin_input');
    fetch(`${URL_BACK}/public/dessin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pseudo: pseudo.value,
            nom: nom.value
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Erreur serveur");
        }
    })
    .then(data => {
        const dessins = data.images;
        const corps = document.getElementById('liste_dessin')
        dessins.forEach(dessin => { 
            corps.appendChild(elt_dessin(dessin,false))
        });
    })
} 

function UserPublicDessin(){
    const pseudo = document.getElementById('pseudo_input');
    const nom = document.getElementById('nom_dessin_input');
    fetch(`${URL_BACK}/user/public/dessin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pseudo: pseudo.value,
            nom: nom.value
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Erreur serveur");
        }
    })
    .then(data => {
        if (data.authorization) {
            const dessins = data.images;
            console.log(dessins)
            const corps = document.getElementById('liste_dessin')
            if (document.getElementById('OnlyLike').checked) {
                dessins.forEach(dessin => {
                    if (dessin.aime) {
                        corps.appendChild(elt_dessin(dessin,true))
                    }
                });
            }
            else {
                dessins.forEach(dessin => {
                    corps.appendChild(elt_dessin(dessin,true))
                });
            }
        }
        else {
            alert("Erreur lors de la déconnexion");
        }
    })
}


function elt_dessin(dessin,HasLikeButton){
    const Item = document.createElement('div'); //crée une classe ou on mettra l'image et les différents élément
    Item.className='item_dessin';
    Item.id=`${dessin.nom}/${dessin.pseudo}`
    Item.appendChild(eltDessinImage(dessin))
    Item.appendChild(eltDessinRight(dessin,Item,HasLikeButton))
    return Item;
}

function eltDessinImage(dessin){
    const img = document.createElement('img'); //on crée l'image
    img.src = 'data:image/png;base64,' + dessin.imageData; //on la met au bon format en rajoutant le début pour qu'après on puisse la décoder
    img.alt = dessin.nom;
    img.classList="image_user";
    img.addEventListener('click',function () {
        voirOnly(dessin.nom)});
    return img;
}

function eltDessinRight(dessin,Item,HasLikeButton){
    const item_Right = document.createElement('div');
    item_Right.classList="item_right";
    const p1 = document.createElement('p');
    p1.innerText = dessin.pseudo;
    p1.classList="pseudo_item";
    const p2 = document.createElement('p');
    p2.innerText = dessin.nom;
    p2.classList="nom_item";
    item_Right.appendChild(p1);
    item_Right.appendChild(p2);
    item_Right.appendChild(eltDessinDivButton(dessin,Item,HasLikeButton));
    return item_Right;
}

function eltDessinDivButton(dessin,Item,HasLikeButton) {
    const divCheckbox = document.createElement('div');
    divCheckbox.classList='item_DivButton';
    divCheckbox.appendChild(eltDessinSignaler(dessin,Item));
    divCheckbox.appendChild(eltDessinDivLike(dessin,HasLikeButton));
    return divCheckbox;
}

function eltDessinDivLike(dessin,HasLikeButton){
    const divLike = document.createElement('div');
    divLike.classList='item_DivLike';
    console.log(HasLikeButton)
    if (HasLikeButton) {
        divLike.appendChild(eltDessinLikeButton(dessin,HasLikeButton));
    }
    divLike.appendChild(eltDessinLikeCount(dessin));
    return divLike;
}

function eltDessinLikeButton(dessin){
    const Checkbox = document.createElement('div');
    Checkbox.classList='item_check'
    const p = document.createElement('p');
    p.innerText = 'Like';
    Checkbox.appendChild(p);
    const label = document.createElement('label');
    label.className="checkbox-container"
    const input = document.createElement('input');
    input.className='custom-checkbox'
    input.checked = dessin.aime;
    input.type="checkbox";
    input.id='public_like';
    input.addEventListener('click', function() {
        DoLike(dessin.pseudo,dessin.nom,input);
    });
    label.appendChild(input);
    const span = document.createElement('span');
    span.className="checkmark";
    label.appendChild(span);
    Checkbox.appendChild(label)
    return Checkbox;
}

function DoLike(pseudo,nom,input){
    if (input.checked) { //car il va prendre l'état courant (donc celui déjà changé)
        Like(pseudo,nom);
    }
    else {
        Unlike(pseudo,nom);
    }
}

function Like(pseudo,nom){
    console.log(pseudo)
    console.log(nom)
    fetch(`${URL_BACK}/user/dessin/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            pseudo: pseudo,
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}

function Unlike(pseudo,nom){
    fetch(`${URL_BACK}/user/dessin/like`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            pseudo: pseudo,
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}

function eltDessinLikeCount(dessin){
    const p1 = document.createElement('p');
    p1.innerText = dessin.nb_aime;
    p1.id=`${dessin.nom}/${dessin.pseudo}/nb_like`;
    return p1;
}

function eltDessinSignaler(dessin,item){
    const button = document.createElement('button');
    button.className = `button_design red`;
    button.id='Signaler';
    button.onclick= function() {Signaler_overlay(item)};
    const span = document.createElement('span');
    span.innerText = 'Signaler';
    button.appendChild(span);
    return button
}

function Signaler_overlay(Item){
    document.getElementById('overlay_signalement').style.display='flex';
    eltASignaler = Item;
}

function EnvoieSignalement(){
    const {nom , pseudo } = GetNomPseudoByItem(eltASignaler);
    fetch(`${URL_BACK}/user/dessin/report`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            pseudo: pseudo,
            nom: nom,
            raison: document.getElementById('RaisonSignalement').value
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Erreur Serveur");
        }
    })
    .then(data => {
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
        else {
            AnnulerSignalement();
        }
    })
}

function GetNomPseudoByItem(Item){
        const parts = Item.id.split('/');
        const nom = parts[0];
        const pseudo = parts[1];
        return { nom, pseudo };
}

function AnnulerSignalement(){
    document.getElementById('overlay_signalement').style.display='none';
    eltASignaler = null;
}

function voirOnly(nom){
    localStorage.setItem('dessin_OnlySee',nom)
    window.location.href=`${window.location.origin}/pages/OnlySee.html`;
}

function MAJLike(data){
    console.log(data.drawingId)
    const elt = document.getElementById(`${data.drawingId}/nb_like`)
    if (elt) {
        elt.textContent = data.likes
    }
}

function MAJId(data){
    console.log(data.drawingId)
    const elt = document.getElementById(`${data.oldId}/nb_like`)
    if (elt) {
        elt.id = `${data.newId}/nb_like`
    }
}