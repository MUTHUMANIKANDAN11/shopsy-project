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

const currentDate = new Date();
const currentTime = currentDate.toISOString();

const order = new Date(params.orderTime);
const current = new Date(currentTime);
const delivery = new Date(params.date);

const persentage = ((current - order) / (delivery - order)) * 100;

document.querySelector('.js-progress-bar').style.width = `${persentage}%`;

const preparing = document.querySelector('.js-preparing');
const shipped = document.querySelector('.js-shipped');
const delivered = document.querySelector('.js-delivered');

if(persentage >= 0 && persentage <= 49){
    changeCurrentStatus(preparing);
} else if(persentage >= 50 && persentage <= 99){
    changeCurrentStatus(shipped);
} else {
    changeCurrentStatus(delivered);
}

function changeCurrentStatus(element){
    preparing.classList.remove('current-status');
    shipped.classList.remove('current-status');
    delivered.classList.remove('current-status');

    element.classList.add('current-status');
}