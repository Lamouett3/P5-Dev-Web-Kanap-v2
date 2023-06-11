// Récuperation de la chaîne de requete dans l'url
const queryString_url_id = window.location.search;
//console.log(queryString_url_id);

/*   
 // methode  pour rextraire l'id avec slice
const get_id = queryString_url_id.slice(1);
console.log(get_id);         */

// methode  pour re-extraire l'id (URLSearchParams)
const get_id = new URLSearchParams(queryString_url_id);
//console.log(get_id);
const id = get_id.get("id");
// console.log(id);

//Récuperation d'un objet par sa key id

// Méthode : avec fetch et en mettant la valeur de l'id a la fin de l'url
const product = fetch(`http://localhost:3000/api/products/${id}`);
//console.log(product);

// Affiche les données de l'id sous forme de tableau
product.then((response) => {
  //  console.log(response);
  // retourne les données au format JSON
  const kanapData = response.json();

  // puise dans le fichier json et retourne le tableau
  kanapData.then((data) => {
    //    console.log(data);

    // Création du contenaire image

    const productImage = document.createElement("img");
    productImage.src = data.imageUrl;
    const containerImage = document.querySelector(".item__img");
    containerImage.appendChild(productImage);
    //    console.log(productImage);

    // Création du contenaire titre
    const productName = document.createElement("h1");
    productName.innerText = data.name;
    const containerName = document.querySelector("#title");
    containerName.appendChild(productName);
    // Création du contenaire prix
    const productPrice = document.createElement("p");
    productPrice.innerText = data.price;
    const containerPrice = document.getElementById("price");
    containerPrice.appendChild(productPrice);

    // Création du contenaire description

    const productDescription = document.createElement("p");
    productDescription.innerText = data.description;
    const containerDescription = document.getElementById("description");
    containerDescription.appendChild(productDescription);

    //    console.log(productDescription);
    // Création du menu déroulant
    let colorsSelector;
    Object.entries(data.colors).forEach((colors) => {
      // console.log(colors);
      colorsSelector = document.createElement("option");
      // création d'une boucle pour le menu déroulant couleur
      for (let i = 0; i < colors.length; i++) {
        colorsSelector.innerText = colors[i];
        const colorBloc = document.getElementById("colors");
        colorBloc.appendChild(colorsSelector);
        // console.log(colorsSelector);
      }
      // RESTE A CORRIGER LE L'AFFICHAGE DES DOUBLON DE COULEUR DANS LE MENU DEROULANT
    });
    //------------------La gestion du panier--------
    // la récuperation des données selectionné par l'utilisateur et  envoie le panier
    //selection du bouton ajouter l'article au panier
    const envoyerPanier = document.getElementById("addToCart");
    //--addEventListener - Ecouter le bouton et envoyer le panier
    envoyerPanier.addEventListener("click", (event) => {
      event.preventDefault();
      // mettre le choix de l'utilisateur dans une variable
      const choixProduit = envoyerPanier.value;

      //-------- Récuperation des valeur du formulaire
      let optionProduit = {
        id_Produit: data._id,
        nomProduit: data.name,
        imageProduit: data.imageUrl,
        altProduit: data.altTxt,
        prixProduit: data.price,
        quantite_Produit: parseInt(document.getElementById("quantity").value), // recuperation des valeurs du menu deroulant pour le panier
        couleur_Produit: document.getElementById("colors").value, // penser a rentrer une fonction pour inclure les quantité du menu déroulant
      };

// Validation de la quantité
if (optionProduit.quantite_Produit <= 0) {
  alert("La quantité doit être supérieure à zéro !");
  return;
}

if (optionProduit.quantite_Produit > 100) {
  alert("La quantité maximale autorisée est de 100.");
  return;
}
      //--------------------Stocker la recuperation des valeurs du formulaire dans le local storage

      let produitLocalStrorage = JSON.parse(localStorage.getItem("produitsPanier")
      );

   // s'il y a deja des produits enregistrer dans le local storage
      if (produitLocalStrorage === null) {
        produitLocalStrorage = [];
        produitLocalStrorage.push(optionProduit);
        localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage)
        );
      }
      else {
        const found = produitLocalStrorage.find(element => element.id_Produit == optionProduit.id_Produit && element.couleur_Produit == optionProduit.couleur_Produit);
        
        if (found == undefined) {
            produitLocalStrorage.push(optionProduit);
            localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage));

//SI PRODUIT AVEC MEME ID ET COULEUR AUGMENTER LA QUANTITE

        } else {
            found.quantite_Produit += optionProduit.quantite_Produit;
            localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage));
        }
    }   
});
});
});
