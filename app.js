const express = require('express') ; 

const app = express() ; 

const tourRouter = require('./Routes/tourRoutes') ;
const userRouter = require('./Routes/userRoutes') ; 


app.use(express.json());

// routes 
app.use('/api/v1/tours' , tourRouter) ; 
app.use('/api/v1/users' , userRouter) ; 

// PUT : entire new object come 
// PATCH : when property of object got updated 

// applying question mark to url make it optional 
// '/api/:x/:y? (so here y is optional)



// server start 

module.exports = app; 