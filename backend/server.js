import express from "express";
import dotenv from "dotenv";
import DBConnection from "./database/db.js";

dotenv.config();
const app = express();

DBConnection();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(5000, () => {
    console.log("Server listening on port");
});

