const express = require("express");
const app = express();

const { userAuth, adminAuth } = require("./middlewares/auth.js")



app.get("/user", (req, res) => {
    // res.send('All data sent');
        throw new Error('nvdsjbvksd');
        res.send('sent');
});

app.use("/",(err,req,res,next) =>{
    if(err){
        res.status(500).send('Something went wrong')
    }
});
app.listen((3000), () => {
    console.log('Server started');
});
