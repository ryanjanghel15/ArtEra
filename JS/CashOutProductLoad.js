const ProductDisplay = document.querySelector("#product-display");
const ProductDescription = document.querySelector("#product-description");
const ProductPrice = document.querySelector("#display-price");
let DataRequirements = window.localStorage.getItem('ProductPrice');.

ProductDisplay.innerHTML = `<span id="product-name">${window.localStorage.getItem('ProductName')}</span>  <span id="product-price">${window.localStorage.getItem('ProductPrice')}</span>`
ProductDescription.textContent = window.localStorage.getItem('ProductDescription');
console.log(window.localStorage.getItem('ProductPrice'));
