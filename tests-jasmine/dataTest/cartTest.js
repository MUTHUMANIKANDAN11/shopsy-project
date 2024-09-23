import { addToCart, cart, loadCartFromLocal } from "../../data/cart.js";

describe("Test Suite: Add a product to cart", () => {
    it("Add a new product", () => {
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });

        loadCartFromLocal();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        
        expect(cart.length).toEqual(1);

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].quantity).toEqual(1);
    });

    it("Add to exist product", () => {
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                deliveryOptionId : 1,
                id : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity : 1
            }]);
        });

        loadCartFromLocal();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        
        expect(cart.length).toEqual(1);

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].quantity).toEqual(2);
    });
});
