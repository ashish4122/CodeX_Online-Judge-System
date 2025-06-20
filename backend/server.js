const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { generateFile } = require('./compiler/generateFile');
const { executeCode } = require('./compiler/execute');
const dbConnection = require('./Models/db.js')

const app = express();

dbConnection();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth",require("./Routes/AuthRouter"));
app.use("/problems" , require("./Routes/problemRoutes"));

app.listen(8000, () => {
    console.log('Server running on port 8000');
});