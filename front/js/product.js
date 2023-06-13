// Récuperation de la chaîne de requete dans l'url
const queryString_url_id = window.location.search;

// methode pour re-extraire l'id (URLSearchParams)
const get_id = new URLSearchParams(queryString_url_id);
const id = get_id.get("id");

//Récuperation d'un objet par sa key id

// Méthode : avec fetch et en mettant la valeur de l'id a la fin de l'url
const product = fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => {
        // retourne les données au format JSON
        const kanapData = response.json();
        kanapData.then((data) => {

            // Creation du title
            document.title = data.name;

            // Création du contenaire image
            const productImage = document.createElement("img");
            productImage.src = data.imageUrl;
            productImage.alt = data.altTxt;
            const containerImage = document.querySelector(".item__img");
            containerImage.appendChild(productImage);

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

            // Création du menu déroulant
            data.colors.forEach((color) => {
                const colorsSelector = document.createElement("option");
                colorsSelector.innerText = color;
                const colorBloc = document.getElementById("colors");
                colorBloc.appendChild(colorsSelector);
            });

            // la récuperation des données selectionné par l'utilisateur et envoie le panier
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
             //     prixProduit: data.price,
                    quantite_Produit: parseInt(document.getElementById("quantity").value), 
                    couleur_Produit: document.getElementById("colors").value,
                };

                // Validation de la quantité
                if (optionProduit.quantite_Produit <= 0) {
                    alert("La quantité doit être supérieure à zéro !");
                    return;
                }

                if (optionProduit.quantite_Produit > 100) {
                    alert("La quantité maximale autorisée par produit est de 100. Veuillez réduire la quantité.");
                    return;
                }

                let produitLocalStrorage = JSON.parse(localStorage.getItem("produitsPanier"));

                // s'il y a deja des produits enregistrer dans le local storage
                if (produitLocalStrorage === null) {
                    produitLocalStrorage = [];
                    produitLocalStrorage.push(optionProduit);
                    localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage));
                }
                else {
                    const found = produitLocalStrorage.find(element => element.id_Produit == optionProduit.id_Produit && element.couleur_Produit == optionProduit.couleur_Produit);
                    
                    if (found == undefined) {
                        produitLocalStrorage.push(optionProduit);
                        localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage));
                    } else {
                        if ((found.quantite_Produit + optionProduit.quantite_Produit) > 100) {
                            alert("La quantité maximale autorisée pour ce produit est de 100. Veuillez réduire la quantité.");
                        } else {
                            found.quantite_Produit += optionProduit.quantite_Produit;
                            localStorage.setItem("produitsPanier", JSON.stringify(produitLocalStrorage));
                        }
                    }
                }   
            });
        });
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });
