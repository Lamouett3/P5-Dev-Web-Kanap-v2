// RÉCUPÉRATION DES ID POUR L'ENVOI À L'API
let productCart = JSON.parse(localStorage.getItem("produitsPanier")) || [];
let getId = productCart.map((product) => product.id_Produit);

// Vérification du panier vide
let isCartEmpty = productCart.length == 0;

// AFFICHAGE DES PRODUITS DU PANIER
if (isCartEmpty) {
  document.querySelector("h1").innerHTML += ` est vide`;
} else {
  document.querySelector("h1").innerHTML += ``;

  // CRÉATION DES VARIABLES TABLEAUX QUI VONT CONTENIR LES QUANTITES ET PRIX DES PRODUITS
  let totalPrice = [];
  let totalQuantity = [];

  // EXTRACTION DU LOCAL STORAGE POUR CRÉATION DE LA FICHE PRODUIT DANS LE PANIER
  for (let i = 0; i < productCart.length; i += 1) {
    // Récupérer le prix à partir de l'API
    fetch(`http://localhost:3000/api/products/${productCart[i].id_Produit}`)
      .then((response) => response.json())
      .then((data) => {
        const prixProduit = data.price;
        const prixTotal = prixProduit * productCart[i].quantite_Produit;
        productCart[i].prixTotal = prixTotal;

        document.querySelector("#cart__items").innerHTML += `
          <article class="cart__item" data-id="${productCart[i].id_Produit}">
            <div class="cart__item__img">
              <img src="${productCart[i].imageProduit}" alt="${productCart[i].altProduit}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
                <h2>${productCart[i].nomProduit}</h2>
                <p>${productCart[i].prixTotal} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Couleur : ${productCart[i].couleur_Produit}</p>
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" canapeId="${productCart[i].id_Produit}" canapeColor="${productCart[i].couleur_Produit}" value="${productCart[i].quantite_Produit}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem" canapeId="${productCart[i].id_Produit}" canapeColor="${productCart[i].couleur_Produit}">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;

        // VARIABLES POUR CHANGER LE TYPE EN NOMBRE
        let quantityNumber = parseInt(productCart[i].quantite_Produit);
        let priceNumber = parseInt(prixTotal);

        // PUSH DES NOMBRES DANS LES VARIABLES TABLEAUX
        totalQuantity.push(quantityNumber);
        totalPrice.push(priceNumber);

        // Mettre à jour le total des quantités et des prix
        const totalQuantityResult = totalQuantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const totalPriceResult = totalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        // Afficher les valeurs dans la section cart__price
        document.querySelector("#totalQuantity").innerHTML = totalQuantityResult;
        document.querySelector("#totalPrice").innerHTML = totalPriceResult;
      })
      .catch((error) => console.log(error));
  }
}

// GERER LES INTERACTIONS AVEC LE FORMULAIRE A REMPLIR
const patterns = {
  firstName: /^[A-Za-zÀ-ÿ\s-]+$/,
  lastName: /^[A-Za-zÀ-ÿ\s-]+$/,
  address: /^[A-Za-z0-9]+([-\s][A-Za-z0-9]+)*$/,
  city: /^[A-Za-zÀ-ÿ-]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

const errorMessages = {
  firstName: "Le champ Prénom n'est pas valide.",
  lastName: "Le champ Nom n'est pas valide.",
  address: "Le champ Adresse n'est pas valide.",
  city: "Le champ Ville n'est pas valide.",
  email: "Le champ Email n'est pas valide.",
};

const showAlert = (inputId) => {
  const errorMessage = errorMessages[inputId];
  const errorElement = document.getElementById(`${inputId}ErrorMsg`);
  errorElement.textContent = errorMessage;
};

const clearErrorMessage = (inputId) => {
  const errorElement = document.getElementById(`${inputId}ErrorMsg`);
  errorElement.textContent = "";
};

const validateInput = (input) => {
  const inputId = input.id;
  const pattern = patterns[inputId];

  if (!pattern.test(input.value)) {
    showAlert(inputId);
  } else {
    clearErrorMessage(inputId);
  }
};

const formInputs = document.querySelectorAll(".cart__order__form__question input");
for (let input of formInputs) {
  input.addEventListener("input", () => {
    validateInput(input);
  });
}

const isFormValid = () => {
  const formInputs = document.querySelectorAll(".cart__order__form__question input");

  for (let input of formInputs) {
    const inputId = input.id;
    const pattern = patterns[inputId];

    if (!pattern.test(input.value)) {
      return false;
    }
  }

  return true;
};

document.querySelector(".cart__order__form__submit").addEventListener("click", function (e) {
  e.preventDefault();

  if (isCartEmpty) {
    alert("Le panier est vide. Veuillez ajouter des produits avant de passer une commande.");
    return;
  }

  if (!isFormValid()) {
    alert("Veuillez corriger les erreurs du formulaire avant de passer la commande.");
    return;
  }

  fetch("http://localhost:3000/api/products/order", {
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
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.removeItem("produitsPanier");
      window.location.href = `confirmation.html?id=${data.orderId}`; 
    })
    .catch((error) => console.log(error));
});

// GESTION DES MODIFICATIONS DU PANIER
document.addEventListener("change", function (e) {
  if (e.target && e.target.className == "itemQuantity") {
    const canapeId = e.target.getAttribute("canapeId");
    const canapeColor = e.target.getAttribute("canapeColor");
    let newQuantity = parseInt(e.target.value);

    // Vérifier si la nouvelle quantité est en dehors de la plage autorisée
    if (newQuantity < 1 || newQuantity > 100) {
      alert("La quantité doit être comprise entre 1 et 100.");
      // Recharger la page pour remettre la valeur précédente
      location.reload();
      return;
    }

    for (let i = 0; i < productCart.length; i++) {
      if (productCart[i].id_Produit == canapeId && productCart[i].couleur_Produit == canapeColor) {
        // Vérifier si la nouvelle quantité dépasse le maximum autorisé
        if (newQuantity > 100) {
          alert("La quantité maximale autorisée est de 100.");
          // Recharger la page pour remettre la valeur précédente
          location.reload();
          return;
        }

        // Vérifier si la nouvelle quantité est 0
        if (newQuantity === 0) {
          alert("La quantité minimale autorisée est de 1.");
          // Recharger la page pour remettre la valeur précédente
          location.reload();
          return;
        }

        productCart[i].quantite_Produit = newQuantity;

        // Mettre à jour le prix dans le localStorage
        fetch(`http://localhost:3000/api/products/${productCart[i].id_Produit}`)
          .then((response) => response.json())
          .then((data) => {
            const prixProduit = data.price;
            const prixTotal = prixProduit * newQuantity;
            productCart[i].prixTotal = prixTotal;

            // Mettre à jour le localStorage
            localStorage.setItem("produitsPanier", JSON.stringify(productCart));

            // Rafraîchir la page
            location.reload();
          })
          .catch((error) => console.log(error));

        break;
      }
    }
  }
});

// GESTION DE LA SUPPRESSION DU PRODUIT
document.addEventListener("click", function (e) {
  if (e.target && e.target.className == "deleteItem") {
    const canapeId = e.target.getAttribute("canapeId");
    const canapeColor = e.target.getAttribute("canapeColor");

    for (let i = 0; i < productCart.length; i++) {
      if (productCart[i].id_Produit == canapeId && productCart[i].couleur_Produit == canapeColor) {
        productCart.splice(i, 1);
        localStorage.setItem("produitsPanier", JSON.stringify(productCart));
        location.reload();
        break;
      }
    }
  }
});
