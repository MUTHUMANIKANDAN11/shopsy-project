export const cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        id : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity : 2
    },{
        id : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity : 1
    }
];

export function addToCart(productId){
    let matchingItem = '';

    cart.forEach((cartItem) => {
        if(cartItem.id === productId){
            matchingItem = cartItem;
        }
    });

    const quantity = Number(document.querySelector(`.quantity-input-${productId}`).value);

    if(matchingItem){
        matchingItem.quantity += quantity;
    } else {
        cart.push({
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

function storeCartInLocal(){
    localStorage.setItem('cart', JSON.stringify(cart));
}