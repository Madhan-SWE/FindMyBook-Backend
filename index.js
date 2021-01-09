const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");

const { scrapObjects } = require("./utilities/scrap")

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3500;

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