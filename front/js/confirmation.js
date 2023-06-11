//RECUPERATION DU NUMERO DE COMMANDE DANS L'URL POUR AFFICHAGE

let params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

// Affiche le numéro de commande rensigner
document.getElementById("orderId").innerHTML += `65431343444684674`;
// ou avec l'id en n' de commande 
//document.getElementById("orderId").innerHTML += `${orderId}`;