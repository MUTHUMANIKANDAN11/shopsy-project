const express = require('express');
const app = express();
const fs = require('fs');
const orders1 = require('./orders1.json');
const { v4: uuidv4 } = require('uuid');
const product = require("./products.json");

function matchingProductItem(productId){
  let matchedItem;
  
  product.forEach((item) => {
    if(item.id === productId){
      matchedItem = item;
    }
  });

  return matchedItem;
}

const cors = require('cors');
app.use(cors());
app.use(express.json());

const { log } = require('console');

app.get('/', (req, res) => {
  return res.send(product);
})

app.post('/orders', (req, res) => {
  const obj = req.body.cart;
  console.log(obj);

  const products = [];
  const today = new Date();
  let totalCents = 0;

  obj.map((item) => {
    let later = 0;
    if(item.deliveryOptionId == '1') later = 7;
    else if(item.deliveryOptionId == '2') later = 3;
    else later = 1;

    const matchedItem = matchingProductItem(item.productId);
    totalCents += matchedItem.priceCents;

    products.push({
      productId: item.productId,
      quantity: item.quantity,
      estimatedDeliveryTime: new Date(Date.now() + later * 24 * 60 * 60 * 1000).toISOString()
    })

  });

  const ans = {
    id: uuidv4(),
    orderTime: today,
    products: products,
    totalCostCents: totalCents
  };

  res.json(ans);
});

app.listen( 3000, () => {
  console.log("Listening ...");
});

