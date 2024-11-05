const express = require("express");
const app = express();


app.use("/user", (req,res,next) =>{
    res.send('Response 1');
    next();
},
(req,res,next) =>{
    res.send('Response 2');
    next();
},
(req,res) =>{
    res.send('Response 3');
});

app.listen((3000), () => {
    console.log('Server started');
});
