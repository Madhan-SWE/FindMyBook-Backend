const cheerio = require("cheerio");
const axios = require("axios");

// flipkartUrl = "https://www.flipkart.com/search?q=books&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off"

snapDealUrl =
    "https://www.snapdeal.com/products/books?sort=plrty&SRPID=customsearch&keywd=books";

function getFlipkartData() {
    console.log("Fetching");
    return axios.get(flipkartUrl);
}

function getSnapdealData() {
    console.log("Fetching SnapDeal Data:");
    return axios.get(snapDealUrl);
}

function processSnapDealData(res, snapDealData) {
    var snapRes = [];
    let $ = cheerio.load(snapDealData);
    let productSectionClass = "div.product-tuple-listing";
    $(productSectionClass).each(function (index, element) {
        const name = $(this)
            .find(
                "div.product-tuple-description>div.product-desc-rating>a>p.product-title"
            )
            .text();
        const author = $(this)
            .find(
                "div.product-tuple-description>div.product-desc-rating>a>p.product-author-name"
            )
            .text();
        const price = $(this)
            .find(
                "div.product-tuple-description>div.product-desc-rating>a>div.product-price-row>div>span.product-desc-price"
            )
            .text();
        const finalPrice = $(this)
            .find(
                "div.product-tuple-description>div.product-desc-rating>a>div.product-price-row>div>span.product-price"
            )
            .text();
        const img = $(this)
            .find("div.product-tuple-image>a>picture>source")
            .attr("srcset");
        let ratingToken =
            "div.product-tuple-description>div.product-desc-rating>a>" +
            "div.rating>div.rating-stars>div.filled-stars";
        const rating = $(this).find(ratingToken).attr("style");
        snapRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
        });
    });
    res.push(snapRes);
}

scrapObjects = () => {
    console.log("Scrapping ...... !");

    let res = [];

    Promise.all([getFlipkartData()]).then((results) => {
        // flipkartData = results[0].data;
        // let flipkartDataFormatted = cheerio.load(flipkartData);
        // console.log("get is done")
        // // let res = flipkartDataFormatted.html('._13oc-S>div>div>a.s1Q9rs')
        // let res = flipkartDataFormatted.html('.product-tuple-listing>div.product-tuple-description>div.product-desc-rating')
        // console.log("---",res)

        let snapDealData = results[0].data;
        processSnapDealData(res, snapDealData);
        console.log(res);
    });
};

module.exports = { scrapObjects };
