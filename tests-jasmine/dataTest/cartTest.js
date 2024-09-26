import { addToCart, cart, deleteFromCart, loadCartFromLocal } from "../../data/cart.js";

describe("Test Suite: Add a product to cart", () => {
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });
    it("Add a new product", () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });

        loadCartFromLocal();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        
        expect(cart.length).toEqual(1);

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            deliveryOptionId:1,
            id:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity:1
        }]));
    });

    it("Add to exist product", () => {
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
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            deliveryOptionId:1,
            id:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity:2
        }]));
    });
});

describe("Test suite: deleteFromCart", () => {
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
    const productId3 = "83d4ca15-0f35-48f5-b7a3-1ea210004f2e";

    beforeEach(() => {
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
    });

    it("Delete a exist product", () => {
        deleteFromCart(productId1);

        expect(cart.length).toEqual(1);
        expect(cart[0].id).toEqual(productId2);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([
            {
                deliveryOptionId: 1,
                id : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                quantity : 1
            }
        ]));
    });

    if("Delete a product not in cart", () => {
        deleteFromCart(productId3);

        expect(cart.length).toEqual(2);
        expect(cart[0].id).toEqual(productId1);
        expect(cart[1].id).toEqual(productId2);expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([
            {
                deliveryOptionId : 2,
                id : productId1,
                quantity : 2
            },{
                deliveryOptionId: 1,
                id : productId2,
                quantity : 1
            }
        ]));
    });
});