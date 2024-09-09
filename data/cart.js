const cart = [
    {
        id : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity : 2
    },{
        id : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity : 1
    }
];

console.log(cart);

function addToCart(productId){
    let matchingItem = '';

    cart.forEach((cartItem) => {
        if(cartItem.id === productId){
            matchingItem = cartItem;
        }
    });

    if(matchingItem){
        matchingItem.quantity++;
    } else {
        cart.push({
            id : productId,
            quantity : 1
        });
    }
    console.log(cart);
}

function cartQuantity(){
    let quantity = 0;
    cart.forEach((cartItem) => {
        quantity += cartItem.quantity;
    });

    return quantity;
}