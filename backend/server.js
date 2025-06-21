const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { generateFile } = require('./compiler/generateFile');
const { executeCode } = require('./compiler/execute');
const dbConnection = require('./Models/db.js')
const { aiCodeReview } = require('./aiCodeReview');

const app = express();

dbConnection();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth",require("./Routes/AuthRouter"));
app.use("/problems" , require("./Routes/problemRoutes"));

app.post("/ai-review", async (req, res) => {
    const { code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const review = await aiCodeReview(code);
        res.json({ "review": review });
    } catch (error) {
        res.status(500).json({ error: "Error in AI review, error: " + error.message });
    }
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});