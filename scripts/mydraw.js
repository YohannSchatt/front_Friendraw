import * as verif from './verif_connexion.js';

const URL_FRONT= import.meta.env.VITE_URL_FRONT
const URL_BACK= import.meta.env.VITE_URL_BACK

var elem_supprimer = null ;

const dessin = document.getElementById("dessin");
const amis = document.getElementById("amis");
const signalement = document.getElementById("signalement");
const Param = document.getElementById("param");
var currentMenu = dessin;

function selectMenu(element){
    currentMenu.classList.remove('active');
    element.classList.add('active');
    currentMenu = element;
}

export function mydraw() {
    verif.Logged
    .then(IsLoggin => {
        if(IsLoggin) {
            currentMenu.classList.add('active');
            const c1 =  document.getElementById("c1");
            const c2 =  document.getElementById("c2");
            const c4 =  document.getElementById("c4");
            c1.onclick = selectDessin;
            c2.onclick = selectAmis;
            c4.onclick = selectParam;
            document.getElementById('supprimer_confirmation').addEventListener('click',supprimerDessinConfirmation)
            document.getElementById('pseudo').value = localStorage.getItem('pseudo');
            document.getElementById('dessiner').addEventListener('click',button_dessin)
            document.getElementById('c_deco').addEventListener('click',deconnexion_click)
            document.getElementById('annuler').addEventListener("click", annuler);
            document.getElementById('delete_account').addEventListener("click", DeleteAccount);
            document.getElementById('delete_account_confirmation').addEventListener("click",DeleteAccountConfirmation);
            document.getElementById('annuler_account_confirmation').addEventListener("click",annulerDeleteAccount);
            document.getElementById('envoieMdp').addEventListener("click",changerMotDePasse)
            document.getElementById('newPseudo').addEventListener("click",changerPseudo)
            FoundDessin();
            verif.Admin
            .then(IsAdmin => {
                if (IsAdmin){
                    const p = document.createElement('p');
                    p.id = "c3";
                    p.innerText='Signalement'
                    document.getElementById('SignalementChoice').appendChild(p);
                    const c3 =  document.getElementById("c3");
                    c3.onclick = selectSignalement;
                }
            })
        }
        else {
            //alert("vous êtes déconnecté, veuillez vous reconnecter");
            //window.location.href=`${window.location.origin}/index.html`
        } 
    })
    .catch(error => {
        //alert("vous êtes déconnecté, veuillez vous reconnecter");
        //window.location.href=`${window.location.origin}/index.html`
    })
}

function selectDessin() {
    selectMenu(dessin);
}

function selectAmis() {
    selectMenu(amis);
}

function selectSignalement() {
    selectMenu(signalement);
    getSignalement();
}

function selectParam(){
    selectMenu(Param);
}

function FoundDessin(){
    fetch(`${URL_BACK}/user/dessin`, {
        method: 'GET',
        credentials: 'include',
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
            const dessins = data.images;
            const corps = document.getElementById('liste_dessin')
            dessins.forEach(dessin => { 
                corps.appendChild(elt_dessin(dessin))
            });
        }
        else {
            alert("Erreur lors de la déconnexion");
        }
    })
}

function elt_dessin(dessin){
    const Item = document.createElement('div'); //crée une classe ou on mettra l'image et les différents élément
    Item.className='item_dessin';
    Item.id=dessin.nom
    Item.appendChild(eltDessinImage(dessin))
    Item.appendChild(eltDessinRight(dessin,Item))
    return Item
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

function eltDessinRight(dessin,Item){
    const item_Right = document.createElement('div');
    item_Right.classList="item_right"
    const p = document.createElement('p');
    p.innerText = dessin.nom;
    p.classList="nom_item";
    item_Right.appendChild(p);
    item_Right.appendChild(eltDessinDivCheckbox(dessin));
    item_Right.appendChild(eltDessinDivbutton(dessin,Item));
    return item_Right
}

function eltDessinDivCheckbox(dessin){
    const divCheckbox = document.createElement('div');
    divCheckbox.classList='item_Divcheck';
    divCheckbox.appendChild(eltDessinCheckbox(IsChecked(dessin.visibilite),'Public',dessin.nom,dopublic))
    divCheckbox.appendChild(eltDessinCheckbox(dessin.favori,'Favori',dessin.nom,dofavorite))
    return divCheckbox;
}

function eltDessinCheckbox(checked,phrase,nom,functionOnClick){
    const Checkbox = document.createElement('div');
    Checkbox.classList='item_check'
    const p = document.createElement('p');
    p.innerText = phrase;
    Checkbox.appendChild(p);
    const label = document.createElement('label');
    label.className="checkbox-container"
    const input = document.createElement('input');
    input.className='custom-checkbox'
    input.checked = checked;
    input.type="checkbox"
    input.id='public';
    input.addEventListener('click', function() {
        functionOnClick(nom,input);
    });
    label.appendChild(input);
    const span = document.createElement('span');
    span.className="checkmark";
    label.appendChild(span);
    Checkbox.appendChild(label)
    return Checkbox;
}

function IsChecked(visibilite){
    if (visibilite == 1) {
        return false
    }
    else {
        return true
    }
}

function eltDessinDivbutton(dessin,Item){
    const DivButton = document.createElement('div');
    DivButton.classList='item_button';
    DivButton.appendChild(eltDessinButton('Supprimer',function() {supprimerDessin(Item)},'supprimer'))
    DivButton.appendChild(eltDessinButton('Modifier',function() {modifierDessin(dessin.nom)},''))
    return DivButton;

}

function eltDessinButton(nomButton,functionOnClick,classAnnexe){
    const button = document.createElement('button');
    button.className = `button_design ${classAnnexe}`;
    button.id=nomButton;
    button.onclick= functionOnClick;
    const span = document.createElement('span');
    span.innerText = nomButton;
    button.appendChild(span);
    return button

}

function supprimerDessin(button) {
    elem_supprimer = button;
    document.getElementById('overlay_supprimer').style.display = 'flex';
}

function SupprimerDivDessin() {
    const corps = document.getElementById('liste_dessin')
    corps.removeChild(elem_supprimer)
}

function supprimerDessinConfirmation(){
    fetch(`${URL_BACK}/user/dessin/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            nom: elem_supprimer.id
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
            SupprimerDivDessin();
            annuler();
        }
        else {
            alert("vous n'êtes pas connecté");
        }
    })
}

function dofavorite(nom,input){
    if (!input.checked) { //car il va prendre l'état courant (donc celui déjà changé)
        Unputfavorite(nom);
    }
    else {
        Putfavorite(nom);
    }
}

function Putfavorite(nom) {
    fetch(`${URL_BACK}/user/dessin/favori`, {
        method: 'PUT',
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}

function Unputfavorite(nom) {
    fetch(`${URL_BACK}/user/dessin/unfavori`, {
        method: 'PUT',
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}

function dopublic(nom,input){
    if (!input.checked) { //car il va prendre l'état courant (donc celui déjà changé)
        Unputpublic(nom);
    }
    else {
        Putpublic(nom);
    }
}

function Unputpublic(nom) {
    fetch(`${URL_BACK}/user/dessin/unpublic`, {
        method: 'PUT',
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}

function Putpublic(nom) {
    fetch(`${URL_BACK}/user/dessin/public`, {
        method: 'PUT',
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
        if (!(data.authorization)) {
            alert("vous n'êtes pas connecté");
        }
    })
}


function modifierDessin(nom) {
    localStorage.setItem('save',true);
    localStorage.setItem('nomDessinModif',nom);
    window.location.href=`${window.location.origin}/pages/dessin.html`
}

function voirOnly(nom){
    localStorage.setItem('dessin_OnlySee',nom)
    window.location.href=`${window.location.origin}/pages/OnlySee.html`;
}

function annuler(){
    document.getElementById('overlay_supprimer').style.display = 'none';
}

function deconnexion_click(){
    fetch(`${URL_BACK}/user/deconnexion`, {
        method: 'GET',
        credentials: 'include'
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
        console.log("mes fesses", data)
        if (!data.authorization) {
            alert("Erreur lors de la déconnexion");
        }
        if (window.location.href === `${window.location.origin}/pages/index.html`){
            window.location.reload()
        }
        else{
            window.location.href=`${window.location.origin}/pages/index.html`
        }
    })
}

function button_dessin(){
    localStorage.setItem('save', false)
    localStorage.setItem('nomDessinModif','')
    window.location.href=`${window.location.origin}/pages/dessin.html`
}


//-------------------------Paramètres-------------------------------


function changerPseudo(){
    const newPseudo = document.getElementById('pseudo').value
    const Mdp = document.getElementById('mdp').value
    fetch(`${URL_BACK}/user/pseudo`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            newPseudo: newPseudo,
            mdp: Mdp,
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Pseudo déjà utilisé");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté");
        }
        else {
            alert("Pseudo Changé avec succès");
        }
    })
}

function changerMotDePasse(){
    const oldMdp = document.getElementById('oldMdp').value
    const newMdp = document.getElementById('newMdp').value
    const confirmMdp = document.getElementById('confirmMdp').value
    fetch(`${URL_BACK}/user/mdp`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            oldMdp: oldMdp,
            newMdp: newMdp,
            confirmMdp:confirmMdp
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Problème serveur");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté");
        }
        else {
            alert("Mot de passe changé avec succès");
        }
    })
}

function DeleteAccount(){
    document.getElementById('overlay_delete_account').style.display = 'flex';
}

function annulerDeleteAccount(){
    document.getElementById('overlay_delete_account').style.display = 'none';
}

function DeleteAccountConfirmation(){
    const oldMdp = document.getElementById('oldMdp').value
    const newMdp = document.getElementById('newMdp').value
    const confirmMdp = document.getElementById('confirmMdp').value
    fetch(`${URL_BACK}/user/mdp`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            oldMdp: oldMdp,
            newMdp: newMdp,
            confirmMdp:confirmMdp
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Problème serveur");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté");
        }
        else {
            localStorage.clear();
            alert("Suppresion réussie, retour au menu principal");
            window.location.href = `${window.location.origin}/pages/index.html`;
            
        }
    })
}

//------------------------------------Signalement------------------------------------------

function getSignalement(){
    fetch(`${URL_BACK}/admin/signalement`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Problème serveur");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté, ou vous n'avez pas les droits");
        }
        else {
            const dessins = data.images;
            const corps = document.getElementById('liste_signalement')
            dessins.forEach(dessin => { 
                corps.appendChild(elt_signalement(dessin))
            });
        }
    })
}

function elt_signalement(dessin){
    const Item = document.createElement('div'); //crée une classe ou on mettra l'image et les différents élément
    Item.className='item_dessin';
    Item.id=`${dessin.nom}/${dessin.pseudo}`
    Item.appendChild(eltDessinImage(dessin))
    Item.appendChild(eltDessinRightSignalement(dessin,Item))
    return Item;
}

function eltDessinRightSignalement(dessin,Item){
    const item_Right = document.createElement('div');
    item_Right.classList="item_right";
    const p1 = document.createElement('p');
    p1.innerText = dessin.pseudo;
    p1.classList="pseudo_item_signalement";
    const p2 = document.createElement('p');
    p2.innerText = dessin.nom;
    p2.classList="nom_item_signalement";
    const p3 = document.createElement('p');
    p3.innerText = dessin.raison;
    p3.classList="raison_item_signalement";
    item_Right.appendChild(p1);
    item_Right.appendChild(p2);
    item_Right.appendChild(p3);
    item_Right.appendChild(eltDivButtonSignalement(dessin,Item));
    return item_Right;
}

function eltDivButtonSignalement(dessin,Item){
    const divCheckbox = document.createElement('div');
    divCheckbox.classList='itemDivButtonSignalement';
    divCheckbox.appendChild(eltDeleteSignalement(dessin,Item));
    divCheckbox.appendChild(eltAnnulerSignalement(dessin,Item));
    return divCheckbox;
}

function eltDeleteSignalement(dessin,Item){
    const button = document.createElement('button');
    button.className = `button_design red`;
    button.id='SignalementDelete';
    button.onclick= function() {DoDeleteSignalement(dessin,Item)};
    const span = document.createElement('span');
    span.innerText = 'Supprimer';
    button.appendChild(span);
    return button
}

function eltAnnulerSignalement(dessin,Item){
    const button = document.createElement('button');
    button.className = `button_design`;
    button.id='SignalementSupprimer';
    button.onclick= function() {DoAnnulerSignalement(dessin,Item)};
    const span = document.createElement('span');
    span.innerText = 'Annuler';
    button.appendChild(span);
    return button
}

function DoAnnulerSignalement(dessin,Item){
    fetch(`${URL_BACK}/admin/signalement`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            id_signalement: dessin.id_signalement
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Problème serveur");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté, ou vous n'avez pas les droits");
        }
        else {
            supprimerEltSignalement(Item);
        }
    })
}

function DoDeleteSignalement(dessin,Item){
    fetch(`${URL_BACK}/admin/signalement/dessin`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            id_dessin: dessin.id_dessin
        })
    })
    .then(res => {
        if (res.ok){
            return res.json();
        }
        else {
            alert("Problème serveur");
        }
    })
    .then(data => {
        if (!data.authorization) {
            alert("Vous êtes déconnecté, ou vous n'avez pas les droits");
        }
        else {
            supprimerEltSignalement(Item);
        }
    })
}

function supprimerEltSignalement(Item){
    document.getElementById('liste_signalement').removeChild(Item);
}