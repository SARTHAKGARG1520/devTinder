const express = require("express");
const app = express();

app.get("/user", (req,res) =>{
    res.send({name: 'Sarthak Garg', age: 24});
});

app.post("/user", (req,res) =>{
    res.send("data posted");
});

app.delete("/user", (req,res) =>{
    res.send('deleted');
})

app.use("/test", (req, res) => {
    res.send('test');
    console.log('test');
});

app.listen((3000), () => {
    console.log('Server started');
});
