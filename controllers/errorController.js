const AppError = require("../utils/appError");

const handleCastErrorDB = err=> {
    const message = `Invalid ${err.value}.`;

    return new AppError(message , 400) ; 
}
const handleDuplicateFieldsDB = err=> {
    
    const message = `Duplicate field value ${err.keyValue.name} is already present` ; 
    return new AppError(message , 400) ; 
}
const handleValidationErrorDB = err=>
{
    const errors = Object.values(err.errors).map(el => el.message) ; 
    const message = `Invalid input data. ${errors.join('. ')}` ;

    return new AppError(message , 400) ; 
}
const sendErrorDev = (err , res)=>
{
    
     return res.status(err.statusCode).json(
        {
            status : err.status , 
            error : err , 
            message : err.message , 
            stack : err.stack 
        }  
    )
}

const sendErrorProd = (err , res)=>
{
    // operational error --> trusted one which we send back to the client 
    /*  return res.status(err.statusCode).json(
        {
            status : err.status , 
            error : err , 
            message : err.message , 
        })
        */
    if(err.isOperational)
    { 
        res.status(err.statusCode).json(
        {
            status : err.status , 
            //error : err , 
            message : err.message , 
        })
    }
    // programming error 
    else 
    {  
        //console.log(err) ; 
        res.status(500).json(
            {
                status : 'error' , 
                message : 'something went very wrong' 
            }  
        )
    }
    
}
module.exports = (err , req , res , next)=>
{
     
    // in production environment there is need as less and user friendly error 

    // in dev environment we need detailed possible error 
    err.statusCode = err.statusCode || 500 ; 
   
    err.staus = err.status || 'error' ; 

    if(process.env.NODE_ENV === 'development')
    {
        return sendErrorDev(err , res) ; 
    }
    else if(process.env.NODE_ENV === 'production')
    {
        console.log('production mode') ; 
        let error = {...err} ; 

        if(error.code === 11000)
        {
            error = handleDuplicateFieldsDB(error) ; 
        }
        
        if(error.name === 'CastError')
        { 
            error =  handleCastErrorDB(error) ; 
        }  

        if(error.name === 'ValidationError')
        {
            console("found it") ; 
            error = handleValidationErrorDB(error);
        }

        sendErrorProd(error , res) ; 
    }  

    
}