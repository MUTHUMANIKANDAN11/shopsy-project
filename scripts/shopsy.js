import { products, Products, Appliances, Clothing } from "../data/products-class.js";
import {cart} from "../data/cart-class.js";
import { loadProductFromBackend } from "../data/products-class.js";
import { currentAccountId, loadCurrentAccountId } from "../data/accounts.js";

import "../data/accounts.js";

let productSummaryHTML = '';

let products2;

function accountManagement(){
    loadCurrentAccountId();
    console.log(currentAccountId);

    if(currentAccountId){
        document.querySelector('.signin-btn-js').innerHTML = `<img class="user-icon" src="images/icons/user-icon.png" alt="">`;
    } else {
        console.log(currentAccountId);
        document.querySelector('.signin-btn-js').innerHTML = `
            <a class="signin-btn signin-btn-js btn btn-warning" href="signin.html">Sign in</a>`;
    }

    document.querySelector('.order-link-js').addEventListener('click', () => {
        if(currentAccountId === ''){
            window.location.href = './signin.html';
        } else {
            window.location.href = './orders.html';
        }
    });
}

accountManagement();

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
        products.forEach((productItem) => {
            const name = productItem.name.toLocaleLowerCase();
            if(name.includes(text) || productItem.keywords.includes(text)){
                newProduct.push(productItem);
            }
        });
        products2 = newProduct;
    }
    
    renderProductsGrid();
});

function renderProductsGrid(){
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
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            console.log(productId);
            cart.addToCart(productId);
            displayAdded(productId);
            updateQuantityInShopsyPage();
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

    function updateQuantityInShopsyPage(){
        const quantity = cart.cartQuantity();
        document.querySelector('.js-cart-quantity').innerHTML = quantity;
    }
}

document.querySelector('.js-search-button').addEventListener('click', () => {
    const text = document.querySelector('.js-search-bar').value;
    const url = new URLSearchParams({
        search: text
    });

    window.location.href = `shopsy.html?${url.toString()}`;
});