// Récupération de la chaîne de requête dans l'URL
const queryString_url_id = window.location.search;

// Méthode pour extraire l'id (URLSearchParams)
const get_id = new URLSearchParams(queryString_url_id);
const id = get_id.get("id");

// Récupération d'un objet par sa clé id avec fetch
const product = fetch(`http://localhost:3000/api/products/${id}`);

// Affiche les données de l'id sous forme de tableau
product.then((response) => {
  const kanapData = response.json();

  kanapData.then((data) => {
    // Création du titre
    const productTitle = document.head;
    document.title = data.name;

    // Création du conteneur image
    const productImage = document.createElement("img");
    productImage.src = data.imageUrl;
    productImage.alt = data.altTxt;
    const containerImage = document.querySelector(".item__img");
    containerImage.appendChild(productImage);

    // Création du conteneur titre
    const productName = document.createElement("h1");
    productName.innerText = data.name;
    const containerName = document.querySelector("#title");
    containerName.appendChild(productName);

    // Création du conteneur prix
    const productPrice = document.createElement("p");
    productPrice.innerText = data.price;
    const containerPrice = document.getElementById("price");
    containerPrice.appendChild(productPrice);

    // Création du conteneur description
    const productDescription = document.createElement("p");
    productDescription.innerText = data.description;
    const containerDescription = document.getElementById("description");
    containerDescription.appendChild(productDescription);

    // Création du menu déroulant pour les couleurs
    let colorsSelector;
    Object.entries(data.colors).forEach((colors) => {
      colorsSelector = document.createElement("option");
      for (let i = 0; i < colors.length; i++) {
        colorsSelector.innerText = colors[i];
        const colorBloc = document.getElementById("colors");
        colorBloc.appendChild(colorsSelector);
      }
    });

    // Gestion du panier
    const envoyerPanier = document.getElementById("addToCart");
    envoyerPanier.addEventListener("click", (event) => {
      event.preventDefault();

      // Récupération des valeurs du formulaire
      let optionProduit = {
        id_Produit: data._id,
        nomProduit: data.name,
        imageProduit: data.imageUrl,
        altProduit: data.altTxt,
        prixProduit: data.price,
        quantite_Produit: parseInt(document.getElementById("quantity").value),
        couleur_Produit: document.getElementById("colors").value,
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

      //-------------------- Stockage des valeurs du formulaire dans le localStorage

      // Récupération des produits du localStorage
      let produitLocalStorage = JSON.parse(localStorage.getItem("produitsPanier"));

      // Vérifier si le produit existe déjà dans le panier en fonction de l'id et de la couleur
      const foundIndex = produitLocalStorage.findIndex(
        (element) =>
          element.id_Produit == optionProduit.id_Produit &&
          element.couleur_Produit == optionProduit.couleur_Produit
      );

      if (foundIndex !== -1) {
        // Si le produit existe déjà, mettre à jour la quantité
        produitLocalStorage[foundIndex].quantite_Produit += optionProduit.quantite_Produit;
      } else {
        // Sinon, ajouter le produit au panier
        produitLocalStorage.push(optionProduit);
      }

      // Vérifier la quantité totale des produits dans le panier
      const quantiteTotale = produitLocalStorage.reduce(
        (total, produit) => total + produit.quantite_Produit,
        0
      );

      if (quantiteTotale > 100) {
        alert("La quantité maximale autorisée est de 100 pour tous les produits.");
        return;
      }

      localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStorage));
    });
  });
});
