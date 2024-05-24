const URL_BACK= 'efsef'

//Variable où on stock les deux promesses, ainsi cela permet de faire qu'une seule requête au lieu de plusieurs pour vérifier les informations de l'utilisateur sur une page
export const Logged = IsLogged();
export const Admin = IsAdmin();

//Fonction asynchrone qui vérifie si l'utilisateur est bien connecté
//Sortie :  La promesse de la réponse de la route user/verification
async function IsLogged() {
    return fetch(`${URL_BACK}/user/verification`, {
        method: 'GET',
        credentials: 'include'
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
            return data.authorization;
         })
        .catch(error => {
            return false;
        });
}


//Fonction asynchrone qui vérifie si l'utilisateur est administrateur
//Sortie : La promesse de la réponse de la route /admin
async function IsAdmin(){
    return fetch(`${URL_BACK}/admin/`, {
        method: 'GET',
        credentials: 'include'
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
            return data.authorization;
         })
        .catch(error => {
            return false;
        });
}



