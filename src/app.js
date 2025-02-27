const express = require("express");
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
require("./utils/cronjob");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);

connectDB().then((res) => {
    console.log('DB Connected');
    app.listen((process.env.PORT), () => {
        console.log('Server started on PORT '+ process.env.PORT );
    });
})
    .catch((err) => {
        console.log('db not connected');
    });

