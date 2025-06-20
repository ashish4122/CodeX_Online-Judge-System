const express = require('express');
const cors = require('cors');
const { generateFile } = require('./compiler/generateFile');
const { executeCode } = require('./compiler/executeCpp');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth",require("./Routes/AuthRouter"));
app.use("/problems" , require("./Routes/problemRoutes"));
app.post("/run", async (req, res) => {
    const { language, code } = req.body;
    
    if (!code || code.trim() === '') {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    try {
        const filePath = generateFile(language, code);
        const output = await executeCode(filePath);
        res.json({ success: true, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});




app.listen(8000, () => {
    console.log('Server running on port 8000');
});