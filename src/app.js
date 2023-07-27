const express = require("express");
const router = require("./router/routes.");

const app = express()

app.use(express.json())   
app.use("/api/users", router); 
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to MY WALLET"
    })
});

module.exports = app