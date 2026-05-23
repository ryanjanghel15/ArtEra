const API_URL =
    "https://script.google.com/macros/s/AKfycbxjmhHuD3Z_087YNVa5uub81t3YFDnguxMew9U_fiHRkG8hGm0HY1rhn5nJiidOGH1C/exec";

const container =
    document.getElementById("products");

const loading =
    document.getElementById("loading");

fetch(API_URL)

    .then(response => response.json())

    .then(data => {

        loading.style.display = "none";

        data.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "col-lg-3 col-md-6 col-sm-12";

            card.innerHTML = `

                <div class="card card-product text-center mb-3" style="min-width: 10rem;">
                    
                    <img 
                        src="${product.Image}" 
                        alt="${product.Name}" 
                        class="product-thumbnail card-img-top"
                    >

                    <div class="card-body">

                        <h5 class="card-title">${product.Name}</h5>

                        <p class="card-text">${product.Description}</p>

                        <p class="card-text">₹${product.Price}</p>

                        <a 
                            href="#"
                            class="productCardBtn btn btn-primary"

                            data-product-id="${product.ID}"
                            data-product-image="${product.Image}"
                            data-product-name="${product.Name}"
                            data-product-description="${product.Description}"
                            data-product-price="${product.Price}"
                        >
                            View Product
                        </a>

                    </div>

                </div>

            `;

            container.appendChild(card);

        });

    })

    .then(() => {

        const productCardBtn =
            document.querySelectorAll(".productCardBtn");

        console.log(productCardBtn);

        productCardBtn.forEach((a) => {

            a.addEventListener('click', (e) => {

                e.preventDefault();
                window.localStorage.setItem('ProductName',e.target.dataset.productName);
                window.localStorage.setItem('ProductImage',e.target.dataset.productImage);
                window.localStorage.setItem('ProductDescription',e.target.dataset.productDescription);
                window.localStorage.setItem('ProductPrice',e.target.dataset.productPrice);
                console.log(window.localStorage.getItem('ProductName'));
                window.location.href = "/HTML/CashOut.html"
            });

        });

    })

    .catch(error => {

        loading.innerHTML =
            "Failed to load products.";

        console.error(error);

    });