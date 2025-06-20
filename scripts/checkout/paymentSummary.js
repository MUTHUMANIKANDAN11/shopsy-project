import { deliveryOptions } from "../../data/deliveryOptions.js";
import { matchingProductItem } from "../../data/products.js";
import { moneyFormat } from "../../others/money-format.js";
import { createOrder, clearCart, getUserProfile, updateUserProfile } from "../utils/api.js";

export function renderPaymentSumary(cart) {
    const quantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    let initialAmount = 0;
    let shippingAmount = 0;

    cart.products.forEach((cartItem) => {
        const matchedProduct = matchingProductItem(cartItem.productId);
        initialAmount += matchedProduct.priceCents * cartItem.quantity;

        // Find the selected delivery option for the item
        const deliveryOption = deliveryOptions.find(option => option.id === (cartItem.deliveryOptionId || '1'));
        if (deliveryOption) {
            shippingAmount += deliveryOption.priceCents;
        }
    });

    const beforeTax = initialAmount + shippingAmount;
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
            const user = await getUserProfile();
            let deliveryAddress = user.address;

            if (!deliveryAddress || deliveryAddress.trim() === '') {
                deliveryAddress = prompt('Please enter your delivery address to continue:');
                if (!deliveryAddress || deliveryAddress.trim() === '') {
                    alert('A delivery address is required to place an order.');
                    return;
                }
                await updateUserProfile({ address: deliveryAddress });
            }
            
            await createOrder({
                cart: cart.products,
                deliveryAddress,
            });

            await clearCart();
            window.location.href = './orders.html';
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Could not place order. Please try again.');
        }
    });
}