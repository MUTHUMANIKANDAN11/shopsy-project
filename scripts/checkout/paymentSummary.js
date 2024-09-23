import { cart, cartQuantity } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { matchingProductItem } from "../../data/products.js";
import { moneyFormat } from "../../others/money-format.js";

export function renderPaymentSumary(){
    const quantity = cartQuantity();
    let initialAmount = 0;
    let shippingAmount = 0;

    cart.forEach((cartItem) => {
        const matchedProduct = matchingProductItem(cartItem.id);
        initialAmount += matchedProduct.priceCents * cartItem.quantity;

        deliveryOptions.forEach((option) => {
            if(option.id === cartItem.deliveryOptionId){
                shippingAmount += option.priceCents;
            }
        });
    });

    const beforeTax = initialAmount+shippingAmount;
    const taxAmount = Math.round(beforeTax * 0.10);
    const totalAmount = beforeTax + taxAmount;

    const paymentSummaryHTML = `
    
        <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${quantity}):</div>
            <div class="payment-summary-money">$${moneyFormat(initialAmount)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${moneyFormat(shippingAmount)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${moneyFormat(beforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${moneyFormat(taxAmount)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${moneyFormat(totalAmount)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}