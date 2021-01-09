const cheerio = require("cheerio");

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
            // console.log(rating)
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

module.exports = { processSnapDealData }