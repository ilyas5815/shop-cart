 document.addEventListener('DOMContentLoaded', function() {

            //Selects the element's classes and then assigns them to the variables

            let productsContainer = document.querySelector('.products');
            let iconCart = document.querySelector('.iconCart');
            let body = document.querySelector('body');
            let closeCart = document.querySelector('.close');
            let listCartHtml = document.querySelector('.listCart');
            let iconCartSpan = document.querySelector('.iconCart span');

            // Initializes an empty array 'carts' to store cart items.
            let carts = [];

            // Initializes an empty array 'productsData' to store product data.
            let productsData = [];

            // Adds an event listener to 'iconCart' that toggles the 'showCart' class on the 'body' element, showing or hiding the cart tab.
            iconCart.addEventListener('click', () => {
                body.classList.toggle('showCart');
            });
            // Adds an event listener to 'closeCart' that toggles the 'showCart' class on the 'body' element, showing or hiding the cart tab.
            closeCart.addEventListener('click', () => {
                body.classList.toggle('showCart');
            });
            
            // Defines an asynchronous function 'fetchProducts' that takes a URL as an argument.
            async function fetchProducts(url) {
                try {
                    // Fetches data from the given URL and waits for the response, assigning it to 'data'.
                    let data = await fetch(url);

                     // Parses the JSON response and assigns it to 'response'.
                    let response = await data.json();

                    // Stores the fetched product data in the 'productsData' array.
                    productsData = response;

                     // Calls 'renderProducts' to display the fetched products on the page.
                    renderProducts(response);
                } catch (error) {

                    // Logs any error that occurs during the fetch process to the console.
                    console.error(error);
                }
            }


            // Defines the 'renderProducts' function that takes a list of products as an argument.
            function renderProducts(products) {

                // Clears the 'productsContainer' element.
                productsContainer.innerHTML = '';

                // Loops through each product in the products array.
                products.forEach(product => {

                    // Stores the product title in 'productTitle'.Clearing the listCartHtml element ensures that the cart display is updated correctly each time a change occurs (such as adding or removing an item).
                    let productTitle = product.title;

                    // Stores the product description in 'description'.
                    let description = product.description;
                    
                    // Adds a div element for each product to the 'productsContainer', displaying the product details.
                    productsContainer.innerHTML += `
                        <div class="product">
                            <img src="${product.image}" alt="${product.category}">
                            <div class="product-content">
                                <h2 class="product-title">${productTitle.length > 15 ? productTitle.substring(0, 15).concat('..') : productTitle}</h2>
                                <h4 class="product-category">${product.category}</h4>
                                <p class="product-description">${description.length > 55 ? description.substring(0, 55).concat('...more') : description}</p>
                                <div class="product-price-container">
                                    <h3 class="product-price">${product.price}$</h3>
                                    <a href="#!" data-product-id="${product.id}" class="add-to-cart">Add to Cart</a>
                                </div>
                            </div>
                        </div>`;
                });
            };

            // Adds a click event listener to the 'productsContainer' element.
            productsContainer.addEventListener('click', (event) => {

                // Checks if the clicked element has the 'add-to-cart' class.
                if (event.target.classList.contains('add-to-cart')) {

                    // Gets the 'data-product-id' attribute of the clicked element and stores it in 'productId'.
                    let productId = event.target.getAttribute('data-product-id');

                    // Calls 'addToCart' with 'productId' as an argument.
                    addToCart(productId);
                    body.classList.add('showCart');
                }
            });

            // Defines the 'addToCart' function that takes 'productId' as an argument.
            function addToCart(productId) {

                // Finds the product with the matching 'productId' in 'productsData' and stores it in 'product'.
                let product = productsData.find(p => (p.id == productId) );

                // Finds the index of the product in the 'carts' array and stores it in 'productIndex'.
                let productIndex = carts.findIndex(c => c.productId == productId);

                // Checks if the product is already in the cart., else Adds a new product to the 'carts' array with the initial quantity set to 1.
                if (productIndex > -1) {
                    carts[productIndex].quantity += 1;
                } else {
                    carts.push({ productId: productId, quantity: 1, product: product });
                }

                // Calls 'updateCart' to refresh the cart display.
                updateCart();
            }


            // Defines the 'updateCart' function to update the cart display.
            function updateCart() {

                listCartHtml.innerHTML = '';

                // Loops through each item in the 'carts' array.
                carts.forEach(cartItem => {

                    // Stores the product details in 'cartProduct'.
                    let cartProduct = cartItem.product;

                    // Adds a div element for each cart item to the 'listCartHtml' element, displaying the product details and quantity.
                    listCartHtml.innerHTML += `
                        <div class="item">
                            <div class="image">
                                <img src="${cartProduct.image}" alt="">
                            </div>
                            <div class="name">${cartProduct.title}</div>
                            <div class="total-price">${(cartProduct.price * cartItem.quantity)}$</div>
                            <div class="quantity">
                                <span class="minus" data-product-id="${cartItem.productId}">-</span>
                                <span>${cartItem.quantity}</span>
                                <span class="plus" data-product-id="${cartItem.productId}">+</span>
                            </div>
                        </div>`;
                });

                // Updates the cart icon's span element to show the total quantity of items in the cart.
                iconCartSpan.textContent = carts.reduce((total, cartItem) => total + cartItem.quantity, 0);
            }

            // Adds a click event listener to the 'listCartHtml' element.
            listCartHtml.addEventListener('click', (event) => {

                // Checks if the clicked element has the 'minus' or 'plus' class.
                if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {

                    // Gets the 'data-product-id' attribute of the clicked element and stores it in 'productId'.
                    let productId = event.target.getAttribute('data-product-id');

                    // Finds the index of the product in the 'carts' array and stores it in 'cartIndex'.
                    let cartIndex = carts.findIndex(cartItem => cartItem.productId == productId);

                    // Checks if the clicked element has the 'minus' class.
                    if (event.target.classList.contains('minus')) {
                        
                        if (carts[cartIndex].quantity > 1) {

                            // Decreases the quantity of the product in the cart.
                            carts[cartIndex].quantity = carts[cartIndex].quantity - 1;

                        } else {
                            
                            // Removes the product from the cart if its quantity is 1.
                            carts.splice(cartIndex, 1);
                        }
                    } else if (event.target.classList.contains('plus')) {

                        // Increases the quantity of the product in the cart.
                        carts[cartIndex].quantity = carts[cartIndex].quantity + 1;

                    }

                    // Calls 'updateCart' to refresh the cart display.
                    updateCart();
                }
            });

            // Calls 'fetchProducts' with the given URL to fetch product data from the API.
            fetchProducts('https://fakestoreapi.com/products');
            
 });


 //noted points

 //Arrow function {()=>} is concise way of writing JavaScript functions in shorter way.
 //JS array methods , DOM methods
