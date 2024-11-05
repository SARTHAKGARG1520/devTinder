const express = require("express");
const app = express();

app.use("/test", (req, res) => {
    res.send('test');
    console.log('test');
});

app.use("/hello", (req, res) =>{
    res.send('Hello');
})

app.use("/", (req, res) => {
    res.send('dashboard');
});

app.listen((3000), () => {
    console.log('Server started');
});
