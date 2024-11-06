const express = require("express");
const app = express();

const { userAuth, adminAuth } = require("./middlewares/auth.js")

app.use("/user", userAuth);

// app.use("/admin", adminAuth)


app.get("/user/getData", (req, res, next) => {
    res.send('All data sent');
});

app.get("/admin/getData", adminAuth, (req, res, next) => {
    res.send("admin data sent");
});

app.get("/login", (req, res) => {
    res.send('logged in successfully');
})

app.listen((3000), () => {
    console.log('Server started');
});
