const openModal = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const save = document.getElementById("save");

const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const ageInput = document.getElementById("age");
const moyenneInput = document.getElementById("moyenne");

const tableau = document.getElementById("tableau");
const rechercheInput = document.getElementById("recherche");

const modale = document.getElementById("modals");
const modalContent = document.getElementById("modalContent");
const fermerModal = document.getElementById("fermerModal");
const erreur = document.getElementById("erreur");

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
fermerModal.addEventListener("click", () => modale.classList.add("hidden"));

// Étudiants et ligne en cours

let etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
let ligneEnCoursIndex = null;

// Ouvrir le modal Ajouter / Modifier

openModal.addEventListener("click", () => modal.classList.remove("hidden"));

// Ajouter ou Modifier un étudiant

save.addEventListener("click", () => {
  const prenom = prenomInput.value.trim();
  const nom = nomInput.value.trim();
  const age = ageInput.value.trim();
  const moyenne = moyenneInput.value.trim();

  const m = parseFloat(moyenne);
  if (isNaN(m) || m < 0 || m > 20) {
    erreur.textContent = "note valable entre 0-20";
    return;
  }

  if (!prenom || !nom || !age || !moyenne)
    return alert("Remplissez tous les champs !");

  if (ligneEnCoursIndex !== null) {
    // Modifier étudiant existant
    etudiants[ligneEnCoursIndex] = { prenom, nom, age, moyenne };
    ligneEnCoursIndex = null;
  } else {
    // Ajouter en haut
    etudiants.unshift({ prenom, nom, age, moyenne });
  }

  // Sauvegarde
  localStorage.setItem("etudiants", JSON.stringify(etudiants));

  modal.classList.add("hidden");
  prenomInput.value = nomInput.value = ageInput.value = moyenneInput.value = "";

  afficherEtudiants();
});

// Afficher les étudiants

function afficherEtudiants(filtre = etudiants) {
  tableau.innerHTML = "";

  filtre.forEach((e, index) => {
    const tr = document.createElement("tr");

    // ID
    const id = index + 1;

    tr.innerHTML = `
      <td class="border px-2 py-1">${id}</td>
      <td class="border px-2 py-1">${e.prenom}</td>
      <td class="border px-2 py-1">${e.nom}</td>
      <td class="border px-2 py-1">${e.age}</td>
      <td class="border px-2 py-1">${e.moyenne}</td>
      <td class="border px-2 py-1">
        <button class="bg-yellow-500 text-white px-2 py-1 mx-1 rounded">Modifier</button>
        <button class="bg-red-500 text-white px-2 py-1 mx-1 rounded">Supprimer</button>
        <button class="bg-blue-500 text-white px-2 py-1 mx-1 rounded">Voir</button>
      </td>
    `;

    const [btnModifier, btnSupprimer, btnVoir] = tr.querySelectorAll("button");

    // Modifier
    btnModifier.addEventListener("click", () => {
      prenomInput.value = e.prenom;
      nomInput.value = e.nom;
      ageInput.value = e.age;
      moyenneInput.value = e.moyenne;
      ligneEnCoursIndex = etudiants.indexOf(e);
      modal.classList.remove("hidden");
    });

    // Supprimer
    btnSupprimer.addEventListener("click", () => {
      etudiants.splice(etudiants.indexOf(e), 1);
      localStorage.setItem("etudiants", JSON.stringify(etudiants));
      afficherEtudiants();
    });

    // Voir
    btnVoir.addEventListener("click", () => {
      modalContent.innerHTML = `
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Prénom:</strong> ${e.prenom}</p>
        <p><strong>Nom:</strong> ${e.nom}</p>
        <p><strong>Age:</strong> ${e.age}</p>
        <p><strong>Moyenne:</strong> ${e.moyenne}</p>
      `;
      modale.classList.remove("hidden");
    });

    tableau.appendChild(tr);
  });
}

rechercheInput.addEventListener("input", () => {
  const mot = rechercheInput.value.toLowerCase();
  const resultat = etudiants.filter(
    (e) =>
      e.prenom.toLowerCase().includes(mot) || e.nom.toLowerCase().includes(mot),
  );
  afficherEtudiants(resultat);
});

afficherEtudiants();
