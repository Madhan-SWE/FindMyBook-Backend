const cheerio = require("cheerio");
const axios = require("axios");

flipkartUrl = "https://www.flipkart.com/search?q=books&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off"

snapDealUrl =
    "https://www.snapdeal.com/products/books?sort=plrty&SRPID=customsearch&keywd=books";

function getFlipkartData() {
    console.log("Fetching Flipkart Data: ");
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

function processFlipkartData(res, flipkartData) {
    var flipRes = [];
    let $ = cheerio.load(flipkartData);
    let productSectionClass = "div._4ddWXP";

    $(productSectionClass).each(function (index, element) {
        const name = $(this)
            .find(
                "a.s1Q9rs"
            )
            .text();
        
        const author = $(this)
            .find(
                "div._3Djpdu"
            )
            .text();
            
        const price = $(this)
            .find(
                "a._8VNy32>div._25b18c>div._3I9_wc"
            )
            .text();
        const finalPrice = $(this)
            .find(
                "a._8VNy32>div._25b18c>div._30jeq3"
            )
            .text();
        const img = $(this)
            .find("a._2rpwqI>div>div>div.CXW8mj>img")
            .attr("src");
        let ratingToken =
            "div.gUuXy- > span > div._3LWZlK";
        let rating = $(this).find(ratingToken).text();
        rating = parseFloat(rating);
        let totalRatings = $(this).find("div.gUuXy- > span._2_R_DZ").text();
        console.log(totalRatings)
        flipRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
            totalRatings
        })
    });
    res.push(flipRes)
}

scrapObjects = () => {
    console.log("Scrapping ...... !");

    let res = [];

    Promise.all([getFlipkartData()]).then((results) => {
        // let snapDealData = results[0].data;
        // processSnapDealData(res, snapDealData);

        let flipkartData = results[0].data;
        processFlipkartData(res, flipkartData);

        console.log(res)

    });
};

module.exports = { scrapObjects };
