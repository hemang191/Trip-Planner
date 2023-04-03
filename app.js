const express = require('express') ; 
const AppError = require('./utils/appError') ;
const globalErrorHandler = require('./controllers/errorController') ; 

const app = express() ; 

app.use(express.json());
app.use(express.static(`${__dirname}/public`)) ;


const tourRouter = require('./Routes/tourRoutes') ;
const userRouter = require('./Routes/userRoutes') ; 


 

// routes 
app.use('/api/v1/tours' , tourRouter) ; 
app.use('/api/v1/users' , userRouter) ; 

// PUT : entire new object come 
// PATCH : when property of object got updated 

// applying question mark to url make it optional 
// '/api/:x/:y? (so here y is optional)


// for all unexpected URL's 

app.all('*' , (req , res , next)=>
{
    /*const err = new Error(`Can't find ${req.originalUrl} on this server !`) ; 
    err.status = 'fail' ,
    err.statusCode = 404  ; 


    next(err) ; // passing here err as object to next function it directly direct to error handling middleware whatever the queue was .. 
    */
    next(new AppError(`Can't find ${req.originalUrl} on this server!` , 404)) ; 
});



app.use(globalErrorHandler) ; 

module.exports = app; 