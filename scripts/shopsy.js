import { products, Products, Appliances, Clothing, storeProductLocal } from "../data/products-class.js";
// import {cart} from "../data/cart-class.js"; // Remove local cart
import { loadProductFromBackend } from "../data/products-class.js";
import { addToCart, getCart } from "./utils/api.js";

let productSummaryHTML = '';

let products2;

function accountManagement(){
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const isLoggedIn = !!authToken && !!userData;

    if(isLoggedIn){
        document.querySelector('.signin-btn-js').innerHTML = `<img class="user-icon" src="images/icons/user-icon.png" alt="">`;
    } else {
        document.querySelector('.signin-btn-js').innerHTML = `
            <a class="signin-btn signin-btn-js btn btn-warning" href="signin.html">Sign in</a>`;
    }

    document.querySelector('.order-link-js').addEventListener('click', () => {
        if(!isLoggedIn){
            window.location.href = './signin.html';
        } else {
            window.location.href = './orders.html';
        }
    });
}

accountManagement();

function visibilityAccountPopup(){
    const popup = document.querySelector('.js-account-popup');
    if(popup.classList.contains('disable-account-popup')){
        popup.classList.remove('disable-account-popup');
    } else {
        popup.classList.add('disable-account-popup');
    }
}

document.querySelector('.signin-btn-js').addEventListener('click', () => visibilityAccountPopup());

document.querySelector('.js-signout-btn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    accountManagement();
    visibilityAccountPopup();
});

loadProductFromBackend().then((response) => {
    products2 = response.map((product) => {
        if(product.type === 'clothing'){
          return new Clothing(product);
        }
        if(product.type === 'appliance'){
          return new Appliances(product);
        }
        return new Products(product);
      });
    
    const url = new URL(window.location.href);
    const isParam = url.searchParams.has('search');
    
    if(isParam){
        const text = url.searchParams.get('search').toLocaleLowerCase();
        let newProduct = [];
        products2.forEach((productItem) => {
            const name = productItem.name.toLocaleLowerCase();
            if(name.includes(text) || (productItem.keywords && productItem.keywords.includes(text))){
                newProduct.push(productItem);
            }
        });
        products2 = newProduct;
    }
    
    renderProductsGrid();
});

function renderProductsGrid(){
    productSummaryHTML = '';
    updateQuantityInShopsyPage();
    products2.forEach((product) => {
        productSummaryHTML += `
            <div class="product-container">
                <div class="product-image-container">
                <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                <img class="product-rating-stars"
                    src="${product.getStarURL()}">
                <div class="product-rating-count link-primary">
                    ${product.rating.count}
                </div>
                </div>

                <div class="product-price">
                    ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                <select class="quantity-input-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                </div>

                <div class="product-spacer"></div>

                ${product.getSizeChartLink()}

                <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
                Add to Cart
                </button>
            </div>
        `
    });

    document.querySelector('.js-products-grid').innerHTML = productSummaryHTML;

    document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
        button.addEventListener('click', async () => {
            // Check if user is logged in
            const authToken = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');
            const isLoggedIn = !!authToken && !!userData;
            if (!isLoggedIn) {
                window.location.href = 'signin.html';
                return;
            }
            const productId = button.dataset.productId;
            console.log(productId);
            await addToCart(productId, 1);
            await updateQuantityInShopsyPage();
            displayAdded(productId);
        });
    });

    let timeoutId = {};

    function displayAdded(productId){
        const clicked = document.querySelector(`.js-added-to-cart-${productId}`);
        clicked.classList.add('added-to-cart-clicked');

        if(timeoutId[productId]){
            clearTimeout(timeoutId);
        }

        timeoutId[productId] = setTimeout(() => {
            clicked.classList.remove('added-to-cart-clicked');
            delete timeoutId[productId];
        }, 2000);
    }

    async function updateQuantityInShopsyPage(){
        try {
            const cart = await getCart();
            const quantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.js-cart-quantity').innerHTML = quantity;
        } catch (e) {
            document.querySelector('.js-cart-quantity').innerHTML = 0;
        }
    }
}

document.querySelector('.js-search-button').addEventListener('click', () => {
    const text = document.querySelector('.js-search-bar').value;
    const url = new URLSearchParams({
        search: text
    });

    window.location.href = `shopsy.html?${url.toString()}`;
});