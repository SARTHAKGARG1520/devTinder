const express = require("express");
const app = express();

app.get("/user/:userId/:password", (req,res) =>{
    res.send(req.params);
});

app.listen((3000), () => {
    console.log('Server started');
});
