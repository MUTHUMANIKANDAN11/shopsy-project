import { cart } from "../../data/cart-class.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { loadProductFromBackend } from "../../data/products-class.js";

describe("Test Suite: renderOrderSummary", () => {
    beforeAll((done) => {
        loadProductFromBackend(() => {
            done();
        });
        done();
    });

    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

    beforeEach(() => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-payment-summary"></div>
            <div class="js-return-to-home-link"></div>
        `;

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

        cart.loadCartFromLocal();
        
        renderOrderSummary();
    });

    afterEach(() => {
        document.querySelector('.js-test-container').innerHTML = '';
    });

    it("Display the cart", () => {
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
        expect(document.querySelector(`.js-quantity-label-${productId1}`).innerText).toEqual('2');
        expect(document.querySelector(`.js-quantity-label-${productId2}`).innerText).toEqual('1');
        expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
        expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual("Intermediate Size Basketball");
        expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual('$10.90');
        expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95');
    });

    it("Remove a cart", () => {
        document.querySelector(`.js-delete-quantity-link-${productId1}`).click();

        expect(document.querySelector(`.js-delete-quantity-link-${productId1}`)).toEqual(null);
        expect(cart.cartItem.length).toEqual(1);
        expect(document.querySelector(`.js-delete-quantity-link-${productId2}`)).not.toEqual(null);
        expect(cart.cartItem[0].id).toEqual(productId2);
    });
});