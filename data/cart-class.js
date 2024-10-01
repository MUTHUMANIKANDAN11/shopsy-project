class Cart{
    cartItem;
    localStorageKey;

    constructor(localStorageKey){
        this.localStorageKey = localStorageKey;
        this.loadCartFromLocal();
    }

    loadCartFromLocal(){
        this.cartItem = JSON.parse(localStorage.getItem(this.localStorageKey)) || [
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

    storeCartInLocal(){
        localStorage.setItem(localStorageKey, JSON.stringify(this.cartItem));
    }

    addToCart(productId, quantityCheck = 0){
        let matchingItem = '';
    
        this.cartItem.forEach((cartItem) => {
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
            this.cartItem.push({
                deliveryOptionId : 1,
                id : productId,
                quantity : quantity
            });
        }
        this.storeCartInLocal();
    }

    cartQuantity(){
        let quantity = 0;
        this.cartItem.forEach((cartItem) => {
            quantity += cartItem.quantity;
        });
        return quantity;
    }

    updateQuantity(productId, newQuantity){
        let matchedItem;
        this.cartItem.forEach((item) => {
            if(item.id === productId){
                matchedItem = item;
            }
        });
        matchedItem.quantity = newQuantity;
    
        this.storeCartInLocal();
    }

    deleteFromCart(productId){
        const newCart = [];
        this.cartItem.forEach((cartItem) => {
            if(cartItem.id !== productId){
                newCart.push(cartItem);
            }
        });
        this.cartItem = newCart;
        this.storeCartInLocal();
    }

    updateDeliveryOptionId(productId, deliveryOptionId){
        let matchedItem;
        this.cartItem.forEach((cartItem) => {
            if(cartItem.id === productId){
                matchedItem = cartItem;
            }
        });
        matchedItem.deliveryOptionId = deliveryOptionId;
        this.storeCartInLocal();
    }
}

const cart = new Cart('cart-class');
const businessCart = new Cart('cart-busicess');

console.log(cart);
console.log(businessCart);