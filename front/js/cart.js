// AFFICHAGE DES PRODUITS DU PANIER
let productCart = JSON.parse(localStorage.getItem("produitsPanier"));

// GESTION DU PANIER VIDE ET PLEIN
if (productCart == null || productCart.length == 0) {
  document.querySelector("h1").innerHTML += ` est vide`;
} else {
  document.querySelector("h1").innerHTML += ``;

  // CREATION DES VARIABLES TABLEAUX QUI VONT CONTENIR LES QUANTITES ET PRIX DES PRODUITS
  let totalPrice = [];
  let totalQuantity = [];

  // EXTRACTION DU LOCAL STORAGE POUR CREATION DE LA FICHE PRODUIT DANS LE PANIER
  for (let i = 0; i < productCart.length; i += 1) {
    document.querySelector("#cart__items").innerHTML +=
      `<article class="cart__item" data-id="${productCart[i].id_Produit}">
          <div class="cart__item__img">
            <img src="${productCart[i].imageProduit}" alt="${productCart[i].altProduit}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${productCart[i].nomProduit}</h2>
              <p>${productCart[i].prixProduit * productCart[i].quantite_Produit} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Couleur : ${productCart[i].couleur_Produit}</p>
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" canapeId="${productCart[i].id_Produit}" canapeColor="${productCart[i].couleur_Produit}" value="${productCart[i].quantite_Produit}">
              </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" canapeId="${productCart[i].id_Produit}" canapeColor="${productCart[i].couleur_Produit}">Supprimer</p>
            </div>
          </div>
      </div>
      </article>`;

    // TOTAL PANIER
    // VARIABLES POUR CHANGER LE TYPE EN NOMBRE
    let quantityNumber = parseInt(productCart[i].quantite_Produit);
    let priceNumber = parseInt(
      productCart[i].prixProduit * productCart[i].quantite_Produit
    );

    // PUSH DES NOMBRES DANS LES VARIABLES TABLEAUX
    totalQuantity.push(quantityNumber);
    totalPrice.push(priceNumber);
  }

  // ADDITION DES QUANTITES DES PRODUITS
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalQuantityResult = totalQuantity.reduce(reducer, 0);

  // ADDITION DES PRIX DES PRODUITS
  const totalPriceResult = totalPrice.reduce(reducer, 0);

  document.querySelector(
    "#totalQuantity"
  ).innerHTML += `${totalQuantityResult}`;
  document.querySelector("#totalPrice").innerHTML += `${totalPriceResult}`;
}

// GERER LES INTERACTIONS AVEC LE FORMULAIRE A REMPLIR
// PATTERN POUR VALIDATION DE LETTRES UNIQUEMENT
let patternFirstName = document.querySelector("#firstName");
patternFirstName.setAttribute("pattern", "^[A-Za-zÀ-ÿ\\s-]+$");

let patternLastName = document.querySelector("#lastName");
patternLastName.setAttribute("pattern", "^[A-Za-zÀ-ÿ\\s-]+$");

let patternAddress = document.querySelector("#address");
patternAddress.setAttribute("pattern", "^[A-Za-z0-9]+([\\s-][A-Za-z0-9]+)*$");

let patternCity = document.querySelector("#city");
patternCity.setAttribute("pattern", "^[A-Za-zÀ-ÿ-]+$");

let patternEmail = document.querySelector("#email");
patternEmail.setAttribute(
  "pattern",
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
);

// ALERTE QUAND LES REGEX NE SONT PAS RESPECTÉES
const errorMessages = {
  firstName: "Le champ Prénom n'est pas valide.",
  lastName: "Le champ Nom n'est pas valide.",
  address: "Le champ Adresse n'est pas valide.",
  city: "Le champ Ville n'est pas valide.",
  email: "Le champ Email n'est pas valide."
};

const showAlert = (inputId) => {
  const errorMessage = errorMessages[inputId];
  const errorElement = document.getElementById(`${inputId}ErrorMsg`);
  errorElement.textContent = errorMessage;
  isFormValid = false; // Ajout de cette ligne pour invalider le formulaire
};

const clearErrorMessage = (inputId) => {
  const errorElement = document.getElementById(`${inputId}ErrorMsg`);
  errorElement.textContent = "";
};

// VÉRIFICATION DE LA REGEX APRÈS CHAQUE SAISIE
const validateInput = (input) => {
  const inputId = input.id;
  const regexPattern = input.getAttribute("pattern");
  const regex = new RegExp(`^${regexPattern}$`);

  if (!regex.test(input.value)) {
    showAlert(inputId);
  } else {
    clearErrorMessage(inputId);
  }

  isFormValid = validateFormInputs(); // Validation du formulaire complet
};

// AJOUT DES ÉCOUTEURS D'ÉVÉNEMENTS "input" SUR LES CHAMPS DE SAISIE
const formInputs = document.querySelectorAll(".cart__order__form__question input");
for (let input of formInputs) {
  input.addEventListener("input", () => {
    validateInput(input);
  });
}

// RÉCUPÉRER LES ID POUR L'ENVOI À L'API
let getId = productCart.map((product) => product.id_Produit);

// VALIDATION DES CHAMPS UTILISATEURS ET ENVOI DES DONNÉES À L'API
document.querySelector(".cart__order__form__submit").addEventListener("click", function (e) {
  e.preventDefault();

  const invalidInputs = document.querySelectorAll(".cart__order__form__question input:invalid");
  if (invalidInputs.length > 0) {
    alert("Veuillez corriger les erreurs du formulaire avant de passer la commande.");
    return;
  }

  const isFormValid = validateFormInputs();
  if (!isFormValid) {
    alert("Veuillez corriger les erreurs du formulaire avant de passer la commande.");
    return;
  }

  const result = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      },
      products: getId,
    }),
  });

  result.then(async (answer) => {
    try {
      const data = await answer.json();
      window.location.href = `confirmation.html?id=${data.orderId}`;
      localStorage.clear();
    } catch (e) {}
  });
});

// FONCTION POUR VALIDER LES CHAMPS DU FORMULAIRE
const validateFormInputs = () => {
  const formInputs = document.querySelectorAll(".cart__order__form__question input");
  let isFormValid = true;

  for (let input of formInputs) {
    const regexPattern = input.getAttribute("pattern");
    const regex = new RegExp(`^${regexPattern}$`);

    if (!regex.test(input.value)) {
      isFormValid = false;
      break;
    }
  }

  return isFormValid;
};

/* MODIFICATION DE LA QUANTITÉ AVEC L'INPUT
 *Crée un tableau d'input
 *Cherche l'ID et la couleur du produit présent dans la classe .itemQuantity et le compare au produit présent dans productCart
 *Crée une nouvelle fiche produit avec la quantité mise à jour
 *Met à jour ce produit dans productInLocalStorage
 *Enregistre productCart dans le localStorage et rafraîchit la page
 */
function modifyQuantity() {
  let inputs = document.querySelectorAll('.itemQuantity');
  for (let input of Array.from(inputs)) {
    input.addEventListener("change", (event) => {
      let canapeId = event.target.getAttribute("canapeId");
      let canapeColor = event.target.getAttribute("canapeColor");
      const modify = productCart.find(
        (element) => element.id_Produit == canapeId && element.couleur_Produit == canapeColor
      );

      // Validation de la quantité
      if (input.value > 100) {
        alert("La quantité doit être inférieure ou égale à 100 !");
        input.value = modify.quantite_Produit; // Réinitialiser à la quantité précédente
      } else if (input.value < 1) {
        alert("La quantité doit être supérieure ou égale à 1 !");
        input.value = modify.quantite_Produit; // Réinitialiser à la quantité précédente
      } else {
        modify.quantite_Produit = input.value;
        localStorage.setItem("produitsPanier", JSON.stringify(productCart));
        location.reload();
      }
    });
  }
}

// MODIFICATION DE LA QUANTITÉ À L'OUVERTURE DE LA PAGE
modifyQuantity();


/* SÉLECTION DE L'ÉLÉMENT À SUPPRIMER DANS LE TABLEAU PRODUCTINLOCALSTORAGE
 *Crée un tableau de boutons
 *Cherche l'ID et la couleur du produit présent dans la classe .deleteItem et le compare au produit présent dans productCart
 *Filtre le produit trouvé et le supprime du tableau productCart
 *Enregistre productCart dans le localStorage et rafraîchit la page
 */
function deleteItem() {
  let buttons = document.querySelectorAll(".deleteItem");
  for (let button of Array.from(buttons)) {
    button.addEventListener("click", (e) => {
      let canapeId = e.target.getAttribute("canapeId");
      let canapeColor = e.target.getAttribute("canapeColor");
      const searchDeleteItem = productCart.find(
        (element) => element.id_Produit == canapeId && element.couleur_Produit == canapeColor
      );
      productCart = productCart.filter((item) => item != searchDeleteItem);
      localStorage.setItem("produitsPanier", JSON.stringify(productCart));
      window.location.href = "cart.html";
    });
  }
}

deleteItem();
