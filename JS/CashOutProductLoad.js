const ProductDisplay = document.querySelector("#product-display");

ProductDisplay.textContent = window.localStorage.getItem('ProductName');
console.log(window.localStorage.getItem('ProductPrice'));