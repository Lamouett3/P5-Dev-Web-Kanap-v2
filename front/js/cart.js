//AFFICHAGE DES PRODUITS DU PANIER
let productCart = JSON.parse(localStorage.getItem("produitsPanier"));

//GESTION DU PANIER VIDE ET PLEIN

if (productCart == null || productCart.length == 0) {
  document.querySelector("h1").innerHTML += ` est vide`;
} else {
  document.querySelector("h1").innerHTML += ``;

  //CREATION DES VARIABLES TABLEAUX QUI VONT CONTENIR LES QUANTITES ET PRIX DES PRODUITS

  let totalPrice = [];
  let totalQuantity = [];

  //EXTRACTION DU LOCAL STORAGE POUR CREATION DE LA FICHE PRODUIT DANS LE PANIER

  for (i = 0; i < productCart.length; i += 1) { 
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
// data-id="{product-ID}"
// data-color="{product-color}"

    //TOTAL PANIER
    //VARIABLES POUR CHANGER LE TYPE EN NOMBRE

    let quantityNumber = parseInt(productCart[i].quantite_Produit);
    let priceNumber = parseInt(
      productCart[i].prixProduit * productCart[i].quantite_Produit
    );

    //PUSH DES NOMBRES DANS LES VARIABLES TABLEAUX

    totalQuantity.push(quantityNumber);
    totalPrice.push(priceNumber);
  }

  //ADDITION DES QUANTITES DES PRODUITS

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalQuantityResult = totalQuantity.reduce(reducer, 0);

  //ADDITION DES PRIX DES PRODUITS

  const totalPriceResult = totalPrice.reduce(reducer, 0);

  document.querySelector(
    "#totalQuantity"
  ).innerHTML += `${totalQuantityResult}`;
  document.querySelector("#totalPrice").innerHTML += `${totalPriceResult}`;
}

//GERER LES INTERACTIONS AVEC LE FORMULAIRE A REMPLIR

//PATTERN POUR VALIDATION DE LETTRES UNIQUEMENT

let patternFirstName = document.querySelector("#firstName");
patternFirstName.setAttribute("pattern", "[a-zA-Z-éèà]*");

let patternLastName = document.querySelector("#lastName");
patternLastName.setAttribute("pattern", "[a-zA-Z-éèà]*");

let patternCity = document.querySelector("#city");
patternCity.setAttribute("pattern", "[a-zA-Z-éèà]*");


//RECUPERER LES ID POUR ENVOIE A L'API
let getId = productCart.map((product) => product.id_Produit);

//VALIDATION DES CHAMPS UTILISATEURS ET ENVOI DES DONNEES A L'API

document
  .querySelector(".cart__order__form__submit")
  .addEventListener("click", function (e) {
    e.preventDefault();
    let valid = true;
    for (let input of document.querySelectorAll(
      ".cart__order__form__question input"
    )) {
      valid &= input.reportValidity();
      if (!valid) {
        break;
      }
    }
    if (valid) {
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
    }
  });

/*MODIFICATION DE LA QUANTITE AVEC L'INPUT
 *Crée un tableau d'input
 *Cherche l'ID et la couleur du produit présent dans la classe .itemQuantity et le compare au produit présent dans productCart
 *Crée une nouvelle fiche produit avec la quantité mise à jour
 *Met à jour ce produit dans productInLocalStorage
 *Enregistre productCart dans le localStorage et rafraichit la page
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
      modify.quantite_Produit = input.value;
      productCart = productCart.filter(item => item = modify);
      localStorage.setItem("produitsPanier", JSON.stringify(productCart));
      window.location.href = "cart.html";
    });
  }
}

modifyQuantity();

/*SELECTION DE L'ELEMENT A SUPPRIMER DANS LE TABLEAU PRODUCTINLOCALSTORAGE
 *Crée un tableau de boutons
 *Cherche l'ID et la couleur du produit présent dans la classe .deleteItem et le compare au produit présent dans productCart
 *Filtre le produit trouvé et le supprime du tableau productCart
 *Enregistre productCart dans le localStorage et rafraichit la page
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
