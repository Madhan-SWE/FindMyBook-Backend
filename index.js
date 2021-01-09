const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
var cron = require('node-cron');

const { scrapObjects } = require("./cron/cronMethods")

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3500;

cron.schedule('*/2 * * * *', () => {
    console.log('running a task every 2 minutes');
});

app.listen(port, () => console.log("App is running in port: ", port));

app.get("/getProducts", async (req, resp)=>{
    try{
        scrapObjects()
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            result: false,
        });
    }
})