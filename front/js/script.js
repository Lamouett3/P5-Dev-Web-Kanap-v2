// Récuperer les données dans l'API HTTP
const product = fetch("http://localhost:3000/api/products");

// Affiche le tableau
product.then((response) => {

  // retourne les données au format JSON
  const kanapData = response.json();

  // affiche les données sous forme de array
  kanapData.then((data) => {

  // Création de la boucle
    for (let i = 0; i < data.length; i++) {
      // Création des contenaires
      const productImage = document.createElement("img");
      productImage.src = data[i].imageUrl;
      const productName = document.createElement("h3");
      productName.className = "productName";
      productName.innerText = data[i].name;
      const productDescription = document.createElement("p");
      productDescription.className = "productDescription";
      productDescription.innerText = data[i].description;

      const productLink = document.createElement("a");
      productLink.href = `./product.html?id=${data[i]._id}`;

      // Rattache les contenaire entre eux
      const productContainer = document.createElement("article");
      productContainer.appendChild(productImage);
      productContainer.appendChild(productName);
      productContainer.appendChild(productDescription);
      productLink.appendChild(productContainer);
      const sectionItem = document.querySelector(".items");
      sectionItem.appendChild(productLink);
    }
  });
});

