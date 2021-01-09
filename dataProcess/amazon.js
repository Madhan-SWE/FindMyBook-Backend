// Standard import
const cheerio = require("cheerio");

// Method to process data from Amazon
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
        buyingUrl = "https://www.amazon.in/" + buyingUrl;
        let ratingToken =
            "div.acs-product-block__review>div.acs-product-block__rating>i.a-icon-star-medium";

        // Local method to convert rating into a value
        function convertRating(rating) {
            if (rating) {
                rating = rating.split(" ");
                rating = rating[rating.length - 1];
                rating = rating.split("-");
                rating = rating.slice(3);
                if (rating.length === 1) {
                    rating = rating * 10;
                } else rating = rating.join("");
                rating = parseFloat(rating);
            } else return 0;

            return rating;
        }
        let rating = $(this).find(ratingToken).attr("class");
        rating = convertRating(rating);
        let totalRatings = $(this)
            .find(
                "div.acs-product-block__review>div.acs-product-block__rating>span.acs-product-block__rating__review-count"
            )
            .text();

        amazonRes.push({
            name,
            author,
            price,
            finalPrice,
            img,
            rating,
            totalRatings,
            buyingUrl,
            website: "Amazon",
        });
    });
    res.push(amazonRes);
}

module.exports = { processAmazonData };
