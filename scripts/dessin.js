import * as verif from './verif_connexion.js';

const URL_BACK= import.meta.env.VITE_URL_BACK

const canvas = document.getElementById("canvas"); //récupère le canvas
const ctx = canvas.getContext("2d"); //défini comment on utilise le canvas
var X = 0; //position sur l'axe des abscisse du canvas
var Y = 0; //position sur l'axe des ordonnée du canvas
var CanDrawing = false; //booléen qui donne la permission de dessiner sur le canvas
var isDrawing = false; //booléen qui précise que l'utilisateur dessine ou non
const colorSelector = document.getElementById('colorSelector'); //on récupuère la couleur
var currentTool = null; //valeur qui stocke l'élément en cours d'utilisation
ctx.lineWidth = 3; //valeur par défaut de la taille des lignes
var RectInitialize = false;
var init_Rect_X;
var init_Rect_Y;

canvas.addEventListener('mouseout',OutCanvas); //listener pour savoir si l'utilisateur n'est pas sur le canvas
canvas.addEventListener('mouseenter',InCanvas); //listener pour savoir si l'utilisateur est sur le canvas
canvas.addEventListener('mousemove', (e) => { //listener de postion
    var mousePos = ActualisationSouris(e);
    X = mousePos.x;
    Y = mousePos.y;
});

function init_dessin() {
    if (localStorage.getItem('save') != false && localStorage.getItem('nomDessinModif') != ''){
        recup_image(localStorage.getItem('nomDessinModif'))
    }
    else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    verif.Logged
    .then(IsLogged => {
        if (!IsLogged){
            document.getElementById('sauvegarde').style.display='none';
        }
        else {
            document.getElementById('sauvegarde').addEventListener('click', function() {
                lancer_interface_sauvegarde();
            })
            document.getElementById('save').addEventListener('click', function() {
                sauvegarder();
            })
            document.getElementById('annuler').addEventListener('click', function() {
                quitter_interface_sauvegarde();
            })
        }
    })
    document.getElementById('stylo').addEventListener('click', function() {
        selectTool('stylo');
    })
    document.getElementById('rectangle').addEventListener('click', function() {
        selectTool('rectangle');
    })
    document.getElementById('gomme').addEventListener('click', function() {
        selectTool('gomme');
    })
    document.getElementById('effacer').addEventListener('click', function() {
        effacer();
    })
}

// Appel de init_dessin lorsque la page est chargée
window.addEventListener('load', function() {
    init_dessin();
});

// Fonction pour sélectionner un outil
function selectTool(toolName){
    switch (currentTool) {
        case 'stylo':
            console.log("je supprime les listener de stylo");
            colorSelector.removeEventListener('input',Color);
            canvas.removeEventListener('mousemove', drawLine);
            canvas.removeEventListener('mousedown',init_draw);
            canvas.removeEventListener('mouseup',Fin_Dessin);
            break;
        case 'gomme':
            canvas.removeEventListener('mousemove', drawLine);
            canvas.removeEventListener('mousedown',init_draw);
            canvas.removeEventListener('mouseup',Fin_Dessin);
            break;
        case 'rectangle':
            colorSelector.removeEventListener('input',Color);
            canvas.removeEventListener('click',createRectangle);
            break;
        // case 'seau':
        //     colorSelector.removeEventListener('input',Color);
        //     canvas.removeEventListener('click',Seau);
        //     break;
    }
    const toolButtons = document.querySelectorAll('.outil'); //sélectionne tout les éléments avec la class outil
    toolButtons.forEach(button => { //pour tout les éléments qui sont des outils
        if (button.id === toolName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    switch (toolName) {
        case 'stylo':
            ctx.fillStyle = colorSelector.value; 
            ctx.strokeStyle = colorSelector.value;
            colorSelector.addEventListener('input',Color);
            canvas.addEventListener('mousemove', drawLine);
            canvas.addEventListener('mousedown',init_draw);
            canvas.addEventListener('mouseup',Fin_Dessin);
            break;
        case 'gomme':
            ctx.fillStyle = "white"; 
            ctx.strokeStyle = "white";
            canvas.addEventListener('mousemove', drawLine);
            canvas.addEventListener('mousedown',init_draw);
            canvas.addEventListener('mouseup',Fin_Dessin);
            break;
        case 'rectangle':
            ctx.fillStyle = colorSelector.value; 
            ctx.strokeStyle = colorSelector.value;
            colorSelector.addEventListener('input',Color);
            canvas.addEventListener('click',createRectangle);
            break;
        // case 'seau':
        //     ctx.fillStyle = colorSelector.value; 
        //     ctx.strokeStyle = colorSelector.value;
        //     colorSelector.addEventListener('input',Color);
        //     canvas.addEventListener('click',Seau);
        //     break;
    }
    currentTool = toolName;
}


function Seau() {
    console.log('je lance seau');
    var imageData = Remplissage(X,Y,hexToRgb(colorSelector.value));
    ctx.putImageData(imageData, 0, 0);
}

function Remplissage(x,y,colorRemplissage) {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var startColor = getPixelColor(imageData, x, y);

    if (startColor[0] != colorRemplissage[0] || startColor[1] != colorRemplissage[1] || startColor[2] != colorRemplissage[2]){
        var queue = [[x, y]];
        while(queue.length > 0){
            var position = queue.shift();
            var px = position[0];
            var py = position[1];
            imageData = setPixelColor(imageData,px,py,colorRemplissage);

            queue = verifAndPush(imageData, px, py+1, startColor, queue);
            queue = verifAndPush(imageData, px, py-1, startColor, queue);
            queue = verifAndPush(imageData, px+1, py, startColor, queue);
            queue = verifAndPush(imageData, px-1, py, startColor, queue);
        }
    }
    return imageData;
}

function getPixelColor(imageData, x, y){
    var index = Math.floor((y * imageData.width + x) * 4);
    return [imageData.data[index],imageData.data[index+1],imageData.data[index+2]]
}

function setPixelColor(imageData, x, y, colorRemplissage) {
    var index = Math.floor((y * imageData.width + x) * 4);
    imageData.data[index] = colorRemplissage[0];
    imageData.data[index+1] = colorRemplissage[1];
    imageData.data[index+2] = colorRemplissage[2];
    return imageData;
}

function verifAndPush(imageData, x, y, startColor, queue) {
    if (x < canvas.width && x > 0 && y < canvas.height && y > 0) {
        var currentPixel = getPixelColor(imageData, x, y);
        if (currentPixel[0] == startColor[0] && currentPixel[1] == startColor[1] && currentPixel[2] == startColor[2]){
            queue.push([x,y]);
        }
    }
    return queue;
}

function hexToRgb(hex) {
    // Supprimer le symbole '#' s'il est présent
    hex = hex.replace(/^#/, '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}


function effacer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Color() {
    ctx.fillStyle = colorSelector.value; 
    ctx.strokeStyle = colorSelector.value;
}

function drawLine() {
    if (isDrawing) {
        ctx.lineTo(X,Y);
        ctx.stroke();
    }
}

function init_draw() {
    if (CanDrawing) {
        ctx.beginPath();
        ctx.moveTo(X,Y);
        isDrawing = true;
    }
}


function ActualisationSouris(e){
    const rect = canvas.getBoundingClientRect() //on récupère les bords du canvas
    const scaleX = canvas.width / rect.width;    
    const scaleY = canvas.height / rect.height;  
    return {
        x: (e.clientX - rect.left) * scaleX,     
        y: (e.clientY - rect.top) * scaleY       
    };
}

function MouseInCanvas() {
    return (X >= rect.left && X <= rect.right && Y >= rect.top && Y <= rect.bottom);
}

function InCanvas(){
    CanDrawing = true;
}

function OutCanvas(){
    Fin_Dessin();
    CanDrawing = false;
}

function Fin_Dessin(){
    if (CanDrawing) {
        isDrawing = false;
        ctx.closePath();
    }
}

function selectTaillelignes(value){
    ctx.lineWidth = parseInt(value);
}

function createRectangle(){
    if (MouseInCanvas()) {
        if (RectInitialize){
            const newX = X;
            const newY = Y;
            ctx.lineTo(init_Rect_X,newY);
            ctx.lineTo(newX,newY);
            ctx.lineTo(newX,init_Rect_Y);
            ctx.lineTo(init_Rect_X,init_Rect_Y);
            ctx.stroke();
            RectInitialize = false;
            console.log("j'ai dessiné un rectangle");
        }
        else {
            init_Rect_X = X;
            init_Rect_Y = Y;
            ctx.beginPath();
            ctx.moveTo(init_Rect_X,init_Rect_Y);
            ctx.fillRect(init_Rect_X,init_Rect_Y,1,1);
            RectInitialize = true;
            console.log("j'ai initialisé un rectangle");
        }
    }
}

function lancer_interface_sauvegarde(){
    const inputName = document.getElementById('nom')
    inputName.value = localStorage.getItem('nomDessinModif');
    document.getElementById('overlay').style.display = 'flex';
}

function quitter_interface_sauvegarde(){
    document.getElementById('overlay').style.display = 'none';
}

function toPNG(){
    const imageDataURL = canvas.toDataURL("image/png");
    return imageDataURL
}

function sauvegarder(){
    const Data = createFromData();
    if (localStorage.getItem('nomDessinModif') != ''){
        modif_image(Data);
    }
    else {
        create_image(Data);
    }
}

function createFromData(){
    const nom = document.getElementById('nom').value;
    const check = document.getElementById('public').checked;
    var visibilite;
    if (!check) {
        visibilite = 1;
    }
    else {
        visibilite = 2;
    }
    var formData = new FormData();
    formData.append('newName', nom);
    formData.append('public', visibilite);
    formData.append('file', toPNG());
    return formData;
}

function create_image(dataForm){
    fetch(`${URL_BACK}/user/dessin/`, {
        method: 'POST',
        credentials: 'include',
        body: dataForm
    })
    .then(res => {
        if (res.ok){
            return res.json()
        }
        else {
            throw new Error()
        }
    })
    .then(data => {
        if (data.authorization){
            localStorage.setItem('nomDessinModif',dataForm.get("newName"));
            quitter_interface_sauvegarde();
        }
        else {
            throw new Error();
        }
    })
    .catch(error => {
        console.log(error);
        alert("problème dans la sauvegarde");
        quitter_interface_sauvegarde();
    });
}

function modif_image(data){
    data.append('oldName',localStorage.getItem('nomDessinModif'))
    fetch(`${URL_BACK}/user/dessin/`, {
        method: 'PUT',
        credentials: 'include',
        body: data
    })
    .then(res => {
        if (res.ok){
            return res.json()
        }
        else {
            throw new Error()
        }
    })
    .then(data => {
        quitter_interface_sauvegarde();
    })
    .catch(error => {
        alert("problème dans la sauvegarde");
        quitter_interface_sauvegarde();
    });
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