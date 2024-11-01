const url = new URL(window.location.href);

const params = Object.fromEntries(url.searchParams.entries());

const date = new Date(params.date);

const datenum = date.getDate();
const month = date.toLocaleString('en-US', { month: 'long' });
const day = date.toLocaleString('en-US', { weekday: 'long' });

document.querySelector('.js-delivery-date').innerHTML = `Arriving on ${day}, ${month} ${datenum}`;
document.querySelector('.js-product-name').innerHTML = `${params.name}`;
document.querySelector('.js-product-quantity').innerHTML = `Quantity: ${params.quantity}`;
document.querySelector('.js-product-image').src = `${params.image}`;