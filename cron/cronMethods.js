// standard imports
const mongodb = require("mongodb");

// custom imports
const {
    getAmazonData,
    getFlipkartData,
    getSnapdealData,
} = require("../dataFetch/FetchData");

const { processAmazonData } = require("../dataProcess/amazon");
const { processFlipkartData } = require("../dataProcess/flipkart");
const { processSnapDealData } = require("../dataProcess/snapdeal");
const { getRandom, shuffle } = require("../utilities/utils");

// constants
const numberOfItems = 5;
const dbUrl = process.env.DBURL || "mongodb://localhost:27017";
const dbName = process.env.DBNAME || "bookwormDB";
const collectionName = process.env.COLLECTIONNAME || "books";

// Method to insert scrapped data
async function insertToDB(finalRes) {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db(dbName);
        let res = await db.collection(collectionName).deleteMany({});
        res = await db.collection(collectionName).insertMany(finalRes);
        console.log(finalRes.length);
        console.log("Insertion Successful!");
    } catch (err) {
        console.log(err);
    }
}

scrapObjects = () => {
    let res = [];
    let finalRes = [];

    // Collecting data simultaneously with promise queue
    Promise.all([getSnapdealData(), getFlipkartData(), getAmazonData()]).then(
        (results) => {
            // Processing the collected data
            let snapDealData = results[0].data;
            processSnapDealData(res, snapDealData);

            let flipkartData = results[1].data;
            processFlipkartData(res, flipkartData);

            let amazonData = results[2].data;
            processAmazonData(res, amazonData);

            // Getting limited number of random data
            res[0] = getRandom(res[0], 5);
            console.log(res[0].length);

            res[1] = getRandom(res[1], 5);
            console.log(res[1].length);

            res[2] = getRandom(res[2], 5);
            console.log(res[2].length);

            // Method to push data to final result
            function pushItems(item) {
                finalRes.push(item);
            }

            // Push data to fianl result
            res[0].map(pushItems);
            res[1].map(pushItems);
            res[2].map(pushItems);

            // Shuffling the results
            shuffle(finalRes);
            console.log("Final Result: ", finalRes);

            // Insert results to db
            insertToDB(finalRes);
        }
    );
};

module.exports = { scrapObjects };
