const cheerio = require("cheerio");

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


module.exports = { processFlipkartData }