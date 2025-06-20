import { deliveryOptions } from "../../data/deliveryOptions.js";
import { matchingProductItem } from "../../data/products.js";
import { moneyFormat } from "../../others/money-format.js";
import { createOrder, clearCart } from "../utils/api.js";

export function renderPaymentSumary(cart) {
    const quantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    let initialAmount = 0;
    let shippingAmount = 0;

    cart.products.forEach((cartItem) => {
        const matchedProduct = matchingProductItem(cartItem.productId);
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
        <button class="place-order-button button-primary js-place-order-button">
            Place your order
        </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    document.querySelector('.js-place-order-button').addEventListener('click', async () => {
        try {
            // You may want to collect delivery address and options from the UI
            const deliveryAddress = prompt('Enter your delivery address:');
            const deliveryOptionId = '1'; // Default or get from UI
            const response = await createOrder({
                cart: cart.products,
                deliveryAddress,
                deliveryOptionId
            });
            await clearCart();
            window.location.href = './orders.html';
        } catch (error) {
            console.error('Error placing order:', error);
        }
    });
}