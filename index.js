// standard imports
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
var cron = require("node-cron");

// custom imports
const { scrapObjects } = require("./cron/cronMethods");

// environment configuration
dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// constants
const port = process.env.PORT || 3500;
const dbUrl = process.env.DBURL || "mongodb://localhost:27017";
const dbName = process.env.DBNAME || "bookwormDB";
const collectionName = process.env.COLLECTIONNAME || "books";

// Scrapping E-commerce sites for every 12 hours
cron.schedule("1 */12 * * *", scrapObjects);

// Listen method
app.listen(port, () => console.log("App is running in port: ", port));

// API end point to update database data manually
app.get("/getBooks", async (req, resp) => {
    try {
        // scrapObjects();
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Internal server error",
            result: false,
        });
    }
});

// API end point for getting books details from E-commerce sites
app.get("/books", async (req, resp) => {
    try {
        let client = await mongodb.connect(dbUrl);
        let db = client.db(dbName);
        let result = await db.collection(collectionName).find();
        result = await result.toArray();
        console.log(result.length);
        resp.status(200).json({
            body: result,
            result: true,
            status: 200,
        });
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Internal server error",
            result: false,
            status: 500,
        });
    }
});
