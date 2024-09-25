import { loadCartFromLocal, cart } from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";

describe("Test Suite: renderOrderSummary", () => {
    it("Display the cart", () => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-payment-summary"></div>
            <div class="js-return-to-home-link"></div>
        `;

        const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
        const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

        spyOn(localStorage, "setItem");
        spyOn(localStorage, "getItem").and.callFake(() => {
            return JSON.stringify([{
                deliveryOptionId : 2,
                id : productId1,
                quantity : 2
            },{
                deliveryOptionId: 1,
                id : productId2,
                quantity : 1
            }]);
        });

        loadCartFromLocal();
        
        renderOrderSummary();

        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
        expect(document.querySelector(`.js-quantity-label-${productId1}`).innerText).toEqual('2');
        expect(document.querySelector(`.js-quantity-label-${productId2}`).innerText).toEqual('1');

        document.querySelector('.js-test-container').innerHTML = '';
    });

    it("Remove a cart", () => {
        
    });
});