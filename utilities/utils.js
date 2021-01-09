const cheerio = require("cheerio");
const axios = require("axios");

flipkartUrl = "https://www.flipkart.com/search?q=books&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off"

snapDealUrl =
    "https://www.snapdeal.com/products/books?sort=plrty&SRPID=customsearch&keywd=books";

amazonUrl = "https://www.amazon.in/b?node=976389031"


function getFlipkartData() {
    console.log("Fetching Flipkart Products: ");
    return axios.get(flipkartUrl);
}

function getSnapdealData() {
    console.log("Fetching SnapDeal Products:");
    return axios.get(snapDealUrl);
}

function getAmazonData() {
    console.log("Fetching Amazon Products:")
    return axios.get(amazonUrl)

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
        
        let buyingUrl = $(this).find("div.product-tuple-image>a").attr("href");

        function convertRating(rating){
            console.log(rating)
            if(rating)
            {
                rating = rating.split("width:")[1].split("%")[0]
                rating = parseFloat(rating).toFixed(2)
            
            }
            return rating
            
        }

        let ratingToken =
            "div.product-tuple-description>div.product-desc-rating>a>" +
            "div.rating>div.rating-stars>div.filled-stars";
        let rating = $(this).find(ratingToken).attr("style");
        rating = convertRating(rating)
        let totalRatingsToken = "div.product-tuple-description>div.product-desc-rating>a>" +
        "div.rating>p.product-rating-count";
        let totalRatings = $(this).find(totalRatingsToken).text();
        snapRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
            totalRatings,
            buyingUrl,
            website: "Snapdeal"
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
        
        let buyingUrl = $(this)
        .find("a._2rpwqI")
        .attr("href");
        buyingUrl = "https://www.flipkart.com" + buyingUrl
        let ratingToken =
            "div.gUuXy- > span > div._3LWZlK";
        let rating = $(this).find(ratingToken).text();
        rating = parseFloat(rating)*10;
        let totalRatings = $(this).find("div.gUuXy- > span._2_R_DZ").text();
        console.log(totalRatings)
        flipRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
            totalRatings,
            buyingUrl,
            website: "Flipkart"
        })
    });
    res.push(flipRes)
}

function processAmazonData(res, amazonData) {
    var amazonRes = [];
    let $ = cheerio.load(amazonData);
    let productSectionClass = "div.acs-product-block";

    $(productSectionClass).each(function (index, element) {
        const name = $(this)
            .find(
                "a.acs-product-block__product-title>span.a-truncate>span.a-truncate-full"
            )
            .text();
    
        const author = $(this)
            .find(
                "span.acs-product-block__contributor>span.a-truncate>span.a-truncate-full"
            )
            .text();

        const price = $(this)
            .find(
                "div.acs-product-block__price>span.acs-product-block__price--strikethrough>span.a-offscreen"
            )
            .text();
        const finalPrice = $(this)
            .find(
                "div.acs-product-block__price>span.acs-product-block__price--buying>span.a-offscreen"
            )
            .text();
        const img = $(this)
            .find("div.acs-product-block__product-image>a>img")
            .attr("src");
        let buyingUrl = $(this)
        .find("div.acs-product-block__product-image>a")
        .attr("href");
        buyingUrl = "https://www.amazon.in/" + buyingUrl
        let ratingToken =
            "div.acs-product-block__review>div.acs-product-block__rating>i.a-icon-star-medium";

        function convertRating(rating){
            if(rating)
            {
                rating = rating.split(" ")
                rating = rating[rating.length-1]
                rating = rating.split("-")
                rating = rating.slice(3)
                if (rating.length === 1)
                {
                    rating = rating*10
                }
                else
                    rating = rating.join("")
                rating = parseFloat(rating)
            }
            else
                return 0
            
            return rating
        }
        let rating = $(this).find(ratingToken).attr("class");
        rating = convertRating(rating)
        let totalRatings = $(this).find("div.acs-product-block__review>div.acs-product-block__rating>span.acs-product-block__rating__review-count").text();
        
        amazonRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
            totalRatings,
            buyingUrl,
            website: "Amazon"
        })
    });
    res.push(amazonRes)
}

scrapObjects = () => {
    console.log("Scrapping ...... !");

    let res = [];

    Promise.all([getSnapdealData()]).then((results) => {
        let snapDealData = results[0].data;
        processSnapDealData(res, snapDealData);

        // let flipkartData = results[0].data;
        // processFlipkartData(res, flipkartData);

        // let amazonData = results[0].data;
        // processAmazonData(res, amazonData);

        console.log(res)

    });
};

module.exports = { scrapObjects };
