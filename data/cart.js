export let cart;

export function loadCartFromLocal(){
    cart = JSON.parse(localStorage.getItem('cart')) || [
        {
            deliveryOptionId : 2,
            id : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity : 2
        },{
            deliveryOptionId: 1,
            id : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity : 1
        }
    ];
}

loadCartFromLocal();

function storeCartInLocal(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantityCheck = 0){
    let matchingItem = '';

    cart.forEach((cartItem) => {
        if(cartItem.id === productId){
            matchingItem = cartItem;
        }
    });

    let quantity;

    if(quantityCheck == 0){
        quantity = Number(document.querySelector(`.quantity-input-${productId}`).value);
    }
    else{
        quantity = 1;
    }
    

    if(matchingItem){
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            deliveryOptionId : 1,
            id : productId,
            quantity : quantity
        });
    }
    storeCartInLocal();
}

export function cartQuantity(){
    let quantity = 0;
    cart.forEach((cartItem) => {
        quantity += cartItem.quantity;
    });
    return quantity;
}

export function updateQuantity(productId, newQuantity){
    let matchedItem;
    cart.forEach((item) => {
        if(item.id === productId){
            matchedItem = item;
        }
    });
    matchedItem.quantity = newQuantity;

    storeCartInLocal();
}

export function deleteFromCart(productId){
    const newCart = [];
    cart.forEach((cartItem) => {
        if(cartItem.id !== productId){
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    console.log(cart);
    storeCartInLocal();
}

export function updateDeliveryOptionId(productId, deliveryOptionId){
    let matchedItem;
    cart.forEach((cartItem) => {
        if(cartItem.id === productId){
            matchedItem = cartItem;
        }
    });
    matchedItem.deliveryOptionId = deliveryOptionId;
    storeCartInLocal();
}