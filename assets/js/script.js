let nom            = document.querySelector('#nom');
let prenom         = document.querySelector('#prenom');
let email          = document.querySelector('#email');
let telephone      = document.querySelector('#telephone');
let genre          = document.querySelector('#genre');
let form           = document.querySelector('form');
let envoyer        = document.querySelector('button');
let affichageUsers = document.querySelector('#users');
let divMsg         = document.querySelector('#divMsg');
let editModal      = document.querySelector('#editModal');
let bddDelete      = document.querySelector('#bddDelete');

let contactExists = false;
let userDB;
let imgSrc;



//: Fonction de création d'une card contact

function createCard(value,index){
    card = affichageUsers.appendChild(document.createElement('div'));
    card.classList.add('card');
    card.classList.add('mr-3');
    card.classList.add('flex-shrink-0');
    card.classList.add('bg-dark');
    card.classList.add('text-light');
    divButtons = card.appendChild(document.createElement('div'));
    divButtons.classList.add('d-flex');
    divButtons.classList.add('justify-content-between');
    buttonEdit = divButtons.appendChild(document.createElement('button'));
    buttonEdit.classList.add('btn-edit');
    buttonEdit.classList.add('btn');
    buttonEdit.classList.add('btn-primary');
    buttonEdit.classList.add('mt-1');
    buttonEdit.classList.add('ml-1');
    buttonEdit.setAttribute('data-id',index);
    buttonEdit.setAttribute('type','button');
    buttonEdit.setAttribute('data-toggle','modal');
    buttonEdit.setAttribute('data-target','#editModal');
    buttonEdit.innerHTML = '<i class="fas fa-user-edit"></i>';
    buttonRemove = divButtons.appendChild(document.createElement('button'));
    buttonRemove.classList.add('btn-remove');
    buttonRemove.classList.add('btn');
    buttonRemove.classList.add('btn-danger');
    buttonRemove.classList.add('mt-1');
    buttonRemove.classList.add('mr-1');
    buttonRemove.setAttribute('data-id',index);
    buttonRemove.setAttribute('type','button');
    buttonRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';
    imgCard = card.appendChild(document.createElement('img'));
    imgCard.classList.add('card-img-top');
    imgCard.setAttribute('src',value.image);
    imgCard.setAttribute('alt',value.genre);
    divCardBody = card.appendChild(document.createElement('div'));
    divCardBody.classList.add('card-body');
    divCardBody.classList.add('bg-dark');
    divCardBody.classList.add('text-light');
    h5CardBody = divCardBody.appendChild(document.createElement('h5'));
    h5CardBody.classList.add('card-title');
    h5CardBody.innerHTML = `${value.prenom} ${value.nom}`;
    ulCard = card.appendChild(document.createElement('ul'));
    ulCard.classList.add('list-group');
    ulCard.classList.add('list-group-flush');
    liCard = ulCard.appendChild(document.createElement('li'));
    liCard.classList.add('list-group-item');
    liCard.classList.add('bg-dark');
    liCard.classList.add('text-light');
    liCard.innerHTML = `${value.email}`;
    liCard2 = ulCard.appendChild(document.createElement('li'));
    liCard2.classList.add('list-group-item');
    liCard2.classList.add('bg-dark');
    liCard2.classList.add('text-light');
    liCard2.innerHTML = `${value.telephone}`;
}

//: Fonction d'affichage de toutes les cards de tous les contacts

function usersCards() {
    userDB = JSON.parse(localStorage.getItem('user'));
    affichageUsers.innerHTML = "";
    for(index in userDB) {
        createCard(userDB[index],index);
     }
    setButtonsRmv();
    setButtonsEdit();
}


//: Affichage des contacts au chargement de la page

if (localStorage.getItem('user')) {
    usersCards();
}

//: Enregistrement d'un nouveau contact

form.addEventListener('submit',function(event){
    event.preventDefault();

    contactExists = false;

    //* Gestion de l'url image
    if (genre.value == 'homme') {
        imgSrc = 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random()*100) + '.jpg';
    }
    else {
        imgSrc = 'https://randomuser.me/api/portraits/women/' + Math.floor(Math.random()*100) + '.jpg';
    }

    //* Gestion de l'enregistrement du contact
    if (!localStorage.getItem('user')) {
        userDB = new Array();
        userDB.push({ 'nom' : nom.value, 'prenom' : prenom.value, 'email' : email.value, 'telephone' : telephone.value, 'genre' : genre.value, 'image' : imgSrc });
        localStorage.setItem('user',JSON.stringify(userDB));
        form.reset();
        userDB = JSON.parse(localStorage.getItem('user'));
        usersCards();
    }
    else {
        userDB = JSON.parse(localStorage.getItem('user'));
        //* Vérification de l'existence du contact
        for(values of userDB) {
            if(values.email.toLowerCase().includes(email.value.toLowerCase())) {
                divMsg.classList.replace('d-none','d-block');
                contactExists = true;
                setTimeout(function(){
                    divMsg.classList.replace('d-block','d-none'); 
                },3000)
            }
        }
        //* Si le contact n'existe pas on l'enregistre
        if (!contactExists) {
            userDB.push({ 'nom' : nom.value, 'prenom' : prenom.value, 'email' : email.value, 'telephone' : telephone.value, 'genre' : genre.value, 'image' : imgSrc });
            localStorage.setItem('user',JSON.stringify(userDB));
            form.reset();
            userDB = JSON.parse(localStorage.getItem('user'));
            usersCards();
        }
    }
});


//: Recherche de contact

let searchQuery          = document.querySelector('#searchQuery');
let formSearch           = document.querySelector('#formSearch');
let searchQueryValue     = '';
let searchSelect         = document.querySelector('#searchSelect');
let searchOptionSelected = '';

searchSelect.addEventListener('change',function(){
    searchOptionSelected = this.options[this.selectedIndex].value;
    console.log(searchOptionSelected);
})

formSearch.addEventListener('submit',function(event){
    let indexQuery = new Array();
    event.preventDefault();
    userDB = JSON.parse(localStorage.getItem('user'));
    searchQueryValue = searchQuery.value.toLowerCase();
    if(searchQueryValue == '') {
        usersCards();
    }
    else {
        for(index in userDB) {
            if (userDB[index][searchOptionSelected].toLowerCase().includes(searchQueryValue)) {
                indexQuery.push(index);
            }
        }
        affichageUsers.innerHTML = "";
        for(values of indexQuery) {
            createCard(userDB[values],values);
        } 
    }
    formSearch.reset();
    setButtonsRmv();
    setButtonsEdit();
})

//: Remove

function setButtonsRmv() {
    buttonRemoveAll = document.querySelectorAll('.btn-remove')
    
    for(values of buttonRemoveAll) {
        values.addEventListener('click',function(event){
            event.preventDefault();
            let choix = confirm('Voulez-vous supprimer ce contact');
            if (choix) {
                clickID = this.getAttribute('data-id');
                console.log(clickID);
                userDB = JSON.parse(localStorage.getItem('user'));
                userDB.splice(clickID, 1);
                localStorage.setItem('user',JSON.stringify(userDB));
                usersCards();
            }
        })
    }
}

//: Edit

let editNom        = document.querySelector('#recipient-nom');
let editPrenom     = document.querySelector('#recipient-prenom');
let editEmail      = document.querySelector('#recipient-email');
let editTelephone  = document.querySelector('#recipient-telephone');
let editGenre      = document.querySelector('#recipient-sexe');
let editSrc        = document.querySelector('#recipient-imgSrc');
let validationEdit = document.querySelector('#validationEdit');
let divMsg2        = document.querySelector('#divMsg2');

function setButtonsEdit() {
    buttonEditAll = document.querySelectorAll('.btn-edit')
    
    for(values of buttonEditAll) {
        values.addEventListener('click',function(event){
            event.preventDefault();
            clickID = this.getAttribute('data-id');
            validationEdit.setAttribute('data-id',clickID);
            userDB = JSON.parse(localStorage.getItem('user'));
            editNom.value       = userDB[clickID].nom;
            editPrenom.value    = userDB[clickID].prenom;
            editEmail.value     = userDB[clickID].email;
            editTelephone.value = userDB[clickID].telephone;
            editGenre.value     = userDB[clickID].genre;
            editSrc.value       = userDB[clickID].image;

        })
    }
}

validationEdit.addEventListener('click',function(){
    editID = this.getAttribute('data-id');
    userDB = JSON.parse(localStorage.getItem('user'));
    contactExists = false;
    if(editNom.value != '' && editPrenom.value != '' && editEmail != '' && editTelephone != '' ) {
        for(index in userDB) {
            if(index != editID) {
                if(userDB[index].email.toLowerCase() == editEmail.value.toLowerCase()) {
                    divMsg2.classList.replace('d-none','d-block');
                    contactExists = true;
                    setTimeout(function(){
                        divMsg2.classList.replace('d-block','d-none'); 
                    },3000)
                }
            }
        }
        if (!contactExists) {
            userDB[editID] = { 'nom' : editNom.value, 'prenom' : editPrenom.value, 'email' : editEmail.value, 'telephone' : editTelephone.value, 'genre' : editGenre.value, 'image' : editSrc.value };
            localStorage.setItem('user',JSON.stringify(userDB));
            $('#editModal').modal('hide');
            usersCards();
        }
    }
})

//: Drop BDD

bddDelete.addEventListener('click',function(){
    let choix = confirm('Voulez vous supprimer tous les contacts ?');
    if (choix) {
        localStorage.removeItem('user');
        usersCards();
    }
})


// [{"nom":"Verratti","prenom":"Marco","email":"petithibou@gmail.com","telephone":"0145897562","genre":"femme","image":"https://randomuser.me/api/portraits/women/54.jpg"},{"nom":"Paredes","prenom":"Leandro","email":"madreputa@free.fr","telephone":"0645789632","genre":"homme","image":"https://randomuser.me/api/portraits/men/40.jpg"},{"nom":"Bonnet","prenom":"Anne-Laure","email":"al.bon@bein.fr","telephone":"0689653212","genre":"femme","image":"https://randomuser.me/api/portraits/women/4.jpg"},{"nom":"M'bappé","prenom":"Kylian","email":"kykydu93@free.fr","telephone":"0645789632","genre":"homme","image":"https://randomuser.me/api/portraits/men/95.jpg"}]




