import { cart } from "../../data/cart-class.js";
import { matchingProductItem } from "../../data/products-class.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSumary } from "./paymentSummary.js";
import { moneyFormat } from "../../others/money-format.js";

export function renderOrderSummary(){
    let orderSummaryHTML = '';
    cart.cartItem.forEach((cartItem) => {
        const matchedItem = matchingProductItem(cartItem.productId);
        const productId = matchedItem.id;
        const deliveryOptionId = cartItem.deliveryOptionId;
        
        let deliveryOption;
        deliveryOptions.forEach((option) => {
            if(option.id === deliveryOptionId)
                deliveryOption = option;
        });

        const today = dayjs();
        const later = today.add(Number(deliveryOption.date), 'day');
        const dateString = later.format('dddd, MMMM D');

        orderSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date">
                ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchedItem.image}">

                <div class="cart-item-details">
                <div class="product-name js-product-name-${productId}">
                    ${matchedItem.name}
                </div>
                <div class="product-price js-product-price-${productId}">
                    ${matchedItem.getPrice()}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label js-quantity-label-${productId}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${productId}">
                    Update
                    </span>
                    <input type="text" class="quantity-input js-quantity-input-${productId}">
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${productId}">
                    Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-quantity-link js-delete-quantity-link-${productId}" data-product-id="${productId}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionSummary(productId, cartItem.deliveryOptionId)}
                </div>
            </div>
            </div>
        `;
    });

    function deliveryOptionSummary(productId, deliveryOptionId){
        let deliveryOptionSummaryHTML = '';
        deliveryOptions.forEach((option) => {

            const today = dayjs();
            const later = today.add(Number(option.date), 'day');
            const dateString = later.format('dddd, MMMM D');

            let priceCentsString = option.priceCents;
            priceCentsString = (priceCentsString === 0) ? 'FREE' : `${moneyFormat(priceCentsString)} -`;

            let isChecked = false;
            if(option.id === deliveryOptionId) isChecked = true;
            isChecked = (isChecked) ? 'checked' : '';

            deliveryOptionSummaryHTML += `
                <div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-option-id="${option.id}">
                    <input type="radio" class="delivery-option-input" ${isChecked}
                    name="delivery-option-${productId}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceCentsString} Shipping
                        </div>
                    </div>
                </div>
            `;
        });
        
        return deliveryOptionSummaryHTML;
    }

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
                cart.updateQuantity(productId, quantity);
                renderOrderSummary();
            }
        });
    });

    document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            cart.deleteFromCart(productId);
            renderOrderSummary();
        });
    });

    document.querySelector('.js-return-to-home-link').innerHTML = cart.cartQuantity();

    document.querySelectorAll('.js-delivery-option').forEach((option) => {
        option.addEventListener('click', () => {
            const productId = option.dataset.productId;
            const deliveryOptionId = Number(option.dataset.deliveryOptionId);
            cart.updateDeliveryOptionId(productId, deliveryOptionId);
            renderOrderSummary();
        });
    });

    renderPaymentSumary();
}