import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSumary } from "./checkout/paymentSummary.js";
import { loadProductFromBackend } from "../data/products-class.js";

//import '../data/cart-class.js';
//import "../data/products-class.js";
//import "../data/car-class.js";
//import "../data/backend-practice.js";

loadProductFromBackend().then(() => {
    renderOrderSummary();
    renderPaymentSumary();
});

/*
loadProductFromBackend(() => {
    renderOrderSummary();
    renderPaymentSumary();
});
*/