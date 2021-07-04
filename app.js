const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
app.use(cookieParser());
//Usiing the bosy parser() now its inside the express
app.use(express.json());

const categoryRouter = require('./routes/category');
const tagRouter = require('./routes/tag');
const userRouter = require('./routes/User');
const blogRouter = require('./routes/blog');


app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/tag', tagRouter)
app.use('/blog', blogRouter)



mongoose.connect('mongodb://localhost:27017/mernauth', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
    console.log('successfully connected to database');
});

app.listen(5000, () => {
    console.log('Express server started')
})