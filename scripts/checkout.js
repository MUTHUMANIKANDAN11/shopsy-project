import { cart, updateQuantity } from "../data/cart.js";
import { matchingProductItem } from "../data/products.js";
import { moneyFormat } from "../others/money-format.js";

let orderSummaryHTML = '';

cart.forEach((cartItem) => {
    const matchedItem = matchingProductItem(cartItem.id);
    orderSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchedItem.id}">
        <div class="delivery-date">
            Delivery date: Wednesday, June 15
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchedItem.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchedItem.name}
            </div>
            <div class="product-price">
                $${moneyFormat(matchedItem.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchedItem.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchedItem.id}">
                Update
                </span>
                <input type="text" class="quantity-input js-quantity-input-${matchedItem.id}">
                <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchedItem.id}">
                Save
                </span>
                <span class="delete-quantity-link link-primary">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>

                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                    name="delivery-option-${cartItem.id}">
                    <div>
                    <div class="delivery-option-date">
                        Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                        FREE Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input"
                    name="delivery-option-${cartItem.id}">
                    <div>
                    <div class="delivery-option-date">
                        Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                        $4.99 - Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                    name="delivery-option-${cartItem.id}">
                    <div>
                    <div class="delivery-option-date">
                        Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                        $9.99 - Shipping
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
});

document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
        const input = document.querySelector(`.js-quantity-input-${productId}`);
        input.focus();
        input.value = '';
    });
});

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

        const quantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

        if(quantity>0 && quantity<1000){
            updateQuantity(productId, quantity);
            document.querySelector(`.js-quantity-label-${productId}`).innerHTML = quantity;
        }
    });
});