import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSumary } from "./checkout/paymentSummary.js";
import { loadProductFromBackend, loadProductLocal, storeProductLocal } from "../data/products-class.js";
import { products } from "../data/products-class.js";

//import '../data/cart-class.js';
//import "../data/products-class.js";
//import "../data/car-class.js";
//import "../data/backend-practice.js";


async function loadCheckoutPage(){
    await loadProductFromBackend();
    renderOrderSummary();
    renderPaymentSumary();
}

if(products === "NULL"){
    loadCheckoutPage();
} else {
    loadProductLocal();
    renderOrderSummary();
    renderPaymentSumary();
}

/*
loadProductFromBackend(() => {
    renderOrderSummary();
    renderPaymentSumary();
});
*/