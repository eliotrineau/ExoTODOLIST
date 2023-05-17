import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, setDoc, getDoc, where, writeBatch, query, orderBy, doc, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA0khnF_4n5a8qsB6Bi9iQRACy-V_Nu9UE",
    authDomain: "todolist-4bfb6.firebaseapp.com",
    projectId: "todolist-4bfb6",
    storageBucket: "todolist-4bfb6.appspot.com",
    messagingSenderId: "157608728219",
    appId: "1:157608728219:web:a9f4db6f2e69c18c91983e"
  };


//initialiser firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//récuperer un document sur firebase
const getDocument = async (collectionName) => {
  const DocumentColRef = collection(db, collectionName);
  const DocumentSnapshot = await getDocs(DocumentColRef);
  const DocumentList = DocumentSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
  return DocumentList
}


//vérifier qu'un utilisateur de la collection Utilisateurs existe
const tacheExist = async (nom) => {
  const DocumentColRef = collection(db, "TODOLIST");
  const q = query(DocumentColRef, where("nom", "==", nom))
  const querySnapshot = await getDocs(q);
  const DocumentList = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
  return DocumentList;
};


// fonction pour créer une collection
const createDocument = async (collectionName, newObj) => {
  const DocumentColRef = collection(db, collectionName);
  const DocumentSnapshot = await addDoc(DocumentColRef, newObj);
}


//fonction pour afficher tous les utilisateurs qui existe
const afficherTaches = async () => {
  const taches = await getDocument("TODOLIST");
  const tacheHTML = document.querySelector("#tacheHTML");
  taches.forEach((taches)=>{
    texteHTMLAj.innerHTML ="" //vide le html
    tacheHTML.innerHTML += //affiche le html
    `
    <div class="flex-col border border-[#9BB370] px-8 py-4 rounded-xl text-[#9BB370] text-xl m-2">
      <p class="mb-8">Tâche à faire :</p>
      <p>${taches.nom}</p>
    </div>
    `;
  })
}
afficherTaches();

//fonction pour ajouter une tâche
const ajouterTache = async (nom) => {
  const texteHTMLAj = document.querySelector("#texteHTMLAj"); // on lie le code à l'html avec l'id
  try {
    const tacheExists = await tacheExist(nom); //vérifie si une tâche possédant le même nom existe déjà
    if (tacheExists.length > 0) {
      texteHTMLAj.innerHTML ="" //vide le html
      texteHTMLAj.innerHTML += //affiche le hmtl
      `
      <div class="justify-center">
        <p class="text-[#9BB370] text-xl">La tâche existe déjà !</p>
      </div>
      `;
      return;
    }
    const nouvelleTache = { //creer obj Tache
      nom
    };
    texteHTMLAj.innerHTML ="" //vide le html
    texteHTMLAj.innerHTML += //affiche le hmtl
    `
    <div class="justify-center">
      <p class="text-[#9BB370] text-xl">Tâche ajoutée avec succès !</p>
    </div>
    `;
    await createDocument("TODOLIST", nouvelleTache); //ajouter la tâche à Firebase
  } catch (error) {
      texteHTMLAj.innerHTML ="" //vide le html
      texteHTMLAj.innerHTML += //affiche le hmtl
      `
      <div class="justify-center">
        <p class="text-[#9BB370] text-xl">Une erreur est survenue lors de l'ajout de la tâche !</p>
      </div>
      `;
  }
};

const supprimerTache = async (nom) => {
  const texteHTMLSup = document.querySelector("#texteHTMLSup"); // on lie le code à l'html avec l'id
  try {
    // Vérifie si la tâche existe et récupère ses données
    const q = query(collection(db, "TODOLIST"), where("nom", "==", nom));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) { //si le document recherché n'existe pas / vide alors :
      texteHTMLSup.innerHTML="" //affiche le hmtl
      texteHTMLSup.innerHTML += //affiche le hmtl
      `
      <div class="justify-center">
        <p class="text-[#9BB370] text-xl">La tâche n'existe pas !</p>
      </div>
      `;
      return;
    }
    const tache = querySnapshot.docs[0].data();

    // Vérifie si le mot de passe est correct
    if (tache.nom !== nom) {
      texteHTMLSup.innerHTML="" //affiche le hmtl
      texteHTMLSup.innerHTML += //affiche le hmtl
      `
      <div class="justify-center">
        <p class="text-[#9BB370] text-xl">La tâche n'est pas bien écrite !</p>
      </div>
      `;
      return;
    }

    // Supprime la tâche
    const tacheRef = doc(db, "TODOLIST", querySnapshot.docs[0].id); //cherche l'id de la tâche
    await deleteDoc(tacheRef); //supprime le document correspondant de la BDD firebase
    texteHTMLSup.innerHTML="" //affiche le hmtl
    texteHTMLSup.innerHTML += //affiche le hmtl
    `
    <div class="justify-center">
      <p class="text-[#9BB370] text-xl">La tâche a été supprimé avec succès !</p>
    </div>
    `;
  } catch (error) {
    texteHTMLSup.innerHTML="" //affiche le hmtl
    texteHTMLSup.innerHTML += //affiche le hmtl
    `
    <div class="justify-center">
      <p class="text-[#9BB370] text-xl">Une erreur est survenue lors de la suppression de la tâche !</p>
    </div>
    `;
  }
};

const faireGagner = async () => {
  const gagnantHTML = document.querySelector("#gagnantHTML"); // lie le code à l'html avec l'id
  try {
    const nbDoc = await getDocument("TODOLIST"); // récupère la collection TODOLIST
    const tacheAleatoire = Math.floor(Math.random() * nbDoc.length); //récupère la taille de la collection 
    const tacheAAfficher = nbDoc[tacheAleatoire]; // assigne le nombre aléatoire 
    gagnantHTML.innerHTML = "";
    gagnantHTML.innerHTML += 
    gagnantHTML.innerHTML = // Affiche le html du 4ème document uniquement
      `
      <div class="flex justify-center">
        <div>
          <p class="text-[#9BB370] text-xl">Tâche à faire : ${tacheAAfficher.nom} !</p> 
        </div>
      </div>
      `;
  } catch (error) { // en cas d'erreur alors il affiche cela :
    gagnantHTML.innerHTML = "";
    gagnantHTML.innerHTML += 
    `
    <div class="justify-center">
      <p class="text-[#9BB370] text-xl">Un problème est survenu !</p>
    </div>
    `;
  }
}

const EcouterAjoutTache = async (event) => {
  event.preventDefault(); // permet d'éviter de recharger la page en continu
  const nom = document.querySelector("#nomTacheAj").value; //lier le js à l'html pour le nom de la tâche
  await ajouterTache(nom);
};


const EcouterSupprimer = async (event) => {
  event.preventDefault(); // permet d'éviter de recharger la page en continu
  const nom = document.querySelector("#nomTacheSup").value;//lier le js à l'html pour le pseudo
  await supprimerTache(nom);
};

// Ajout des écoutes pour les boutons d'inscription et de connexion
const btnAjouterTache = document.querySelector("#btnAjouterTache")
btnAjouterTache.addEventListener("click", EcouterAjoutTache);

const btnSupprimer = document.querySelector("#btnSupprimer");
btnSupprimer.addEventListener("click", EcouterSupprimer);

const btnFaireGagner = document.querySelector("#btnFaireGagner");
btnFaireGagner.addEventListener("click", faireGagner);


