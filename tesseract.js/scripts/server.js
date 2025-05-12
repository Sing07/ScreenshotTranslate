"use strict";

const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const express = require("express");
const path = require("path");
const cors = require("cors");
const webpackConfig = require("./webpack.config.prod");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const compiler = webpack(webpackConfig);
const app = express();

const upload = multer({ dest: "uploads/" });

app.use(
    cors({
        origin: "*", // or specify your extension's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);
app.use(middleware(compiler, { publicPath: "/dist", writeToDisk: true }));

// These headers are required to measure memory within the benchmark code.
// If they are problematic within other contexts they can be removed.
app.use(
    express.static(path.resolve(__dirname, ".."), {
        setHeaders: (res) => {
            res.set("Cross-Origin-Opener-Policy", "same-origin");
            res.set("Cross-Origin-Embedder-Policy", "require-corp");
        },
    })
);

app.post("/", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const {
            data: { text },
        } = await Tesseract.recognize(req.file.path, "chi_sim");
        fs.unlinkSync(req.file.path); // Clean up uploaded file
        // res.json({ text });
        res.type("text/plain").send(text);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app.listen(3001, () => {
    console.log("Server is running on the port no. 3001");
});
