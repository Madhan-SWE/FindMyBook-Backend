const axios = require("axios");

flipkartUrl =
    "https://www.flipkart.com/search?q=books&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";

snapDealUrl =
    "https://www.snapdeal.com/products/books?sort=plrty&SRPID=customsearch&keywd=books";

amazonUrl = "https://www.amazon.in/b?node=976389031";

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
