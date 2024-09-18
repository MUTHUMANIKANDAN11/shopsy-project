import { moneyFormat } from "../others/money-format.js";

console.log("Test Suite: Money format conversion");

console.log("Convert cents to dollar");
if(moneyFormat(2024) === '20.24'){
    console.log("Passed");
} else {
    console.log("Failed");
}

console.log("Conversion wth zero");
if(moneyFormat(0) === '0.00'){
    console.log("Passed");
} else {
    console.log("Failed");
}

console.log("Conversion with floating point value");
if(moneyFormat(2000.5) === '20.01'){
    console.log("Passed");
} else {
    console.log("Failed");
}