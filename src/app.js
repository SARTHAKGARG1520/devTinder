const express = require("express");
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB().then((res) => {
    console.log('DB Connected');
    app.listen((3000), () => {
        console.log('Server started');
    });
})
    .catch((err) => {
        console.log('db not connected');
    });

