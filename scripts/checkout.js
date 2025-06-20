import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSumary } from "./checkout/paymentSummary.js";
import { loadProductFromBackend } from "../data/products-class.js";
import { getCart } from "./utils/api.js";

//import '../data/cart-class.js';
//import "../data/products-class.js";
//import "../data/car-class.js";
//import "../data/backend-practice.js";


async function loadCheckoutPage(){
    await loadProductFromBackend();
    const cart = await getCart();
    // Pass cart to order summary and payment summary rendering if needed
    renderOrderSummary(cart);
    renderPaymentSumary(cart);
}

loadCheckoutPage();

/*
loadProductFromBackend(() => {
    renderOrderSummary();
    renderPaymentSumary();
});
*/