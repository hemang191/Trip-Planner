const AppError = require("../utils/appError");

const handleCastErrorDB = err=> {
    const message = `Invalid ${err.path} : ${err.value}.`;

    return new AppError(message , 400) ; 
}
const sendErrorDev = (err , res)=>
{
     res.status(err.statusCode).json(
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
    if(err.isOperational)
    {
        res.status(err.statusCode).json(
        {
            status : err.status , 
            error : err , 
            message : err.message , 
        })
    }
    // programming error 
    else 
    {
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

    console.log(process.env.NODE_ENV) ; 
    if(process.env.NODE_ENV === 'development')
    {
       return sendErrorDev(err , res) ; 
    }

    else if ( process.env.NODE_ENV === 'production')
    {
        let error = {...err} ; 

        if(error.name === 'CastError')
        {
            error =  handleCastErrorDB(err) ; 
        }


        return sendErrorProd(error , res) ; 
    }  

    /*return res.status(err.statusCode).json(
        {
            status : err.status , 
            message : err.message
        }
    );*/

}