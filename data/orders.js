export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
    orders.unshift(order);
    storeOrderLocal();
}

function storeOrderLocal(){
    localStorage.setItem('orders', JSON.stringify(orders));
}