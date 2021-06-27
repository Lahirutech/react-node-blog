const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
app.use(cookieParser());
//Usiing the bosy parser() now its inside the express
app.use(express.json());

const User = require("./models/User")
const userRouter = require('./routes/User');
app.use('/user', userRouter)

mongoose.connect('mongodb://localhost:27017/mernauth', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('successfully connected to database');
});

app.listen(5000, () => {
    console.log('Express server started')
})