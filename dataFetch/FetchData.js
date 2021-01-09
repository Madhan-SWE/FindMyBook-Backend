// Standard import
const axios = require("axios");
const dotenv = require("dotenv");

// Envrionment configuration
dotenv.config();

// Constants
const flipkartUrl =
    process.env.FLIPKART ||
    "https://www.flipkart.com/search?q=books&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";

const snapDealUrl =
    process.env.SNAPDEAL ||
    "https://www.snapdeal.com/products/books?sort=plrty&SRPID=customsearch&keywd=books";

const amazonUrl =
    process.env.AMAZON || "https://www.amazon.in/b?node=976389031";

// Methods to collect data using axio module

function getFlipkartData() {
    console.log("Fetching Flipkart Products: ");
    return axios.get(flipkartUrl);
}

function getSnapdealData() {
    console.log("Fetching SnapDeal Products:");
    return axios.get(snapDealUrl);
}

function getAmazonData() {
    console.log("Fetching Amazon Products:");
    return axios.get(amazonUrl);
}

module.exports = { getFlipkartData, getSnapdealData, getAmazonData };
