const mongoose = require('mongoose') ;
const dotenv = require('dotenv'); 
dotenv.config({path : './config.env'}) ;

process.on('uncaughtException' , err=>
{
    console.log('Uncaught Exception') ; 
    console.log(err.name , err.message) ; 

    process.exit(1) ;   
})


const app = require('./app') ; 

const db_link = process.env.DB_Link ; 
mongoose.connect(db_link , 
    {
        useNewUrlParser :true ,
        useCreateIndex : true ,
        useFindAndModify:false,
        useUnifiedTopology: true
    }).then(conn=>
        {
            console.log('Connected to DB') ; 
        });

const PORT = process.env.PORT  ; 

const server = app.listen(PORT , ()=>
{
    console.log("App is running on PORT no " , PORT) ; 
}); 

process.on('unhandledRejection' , err=>
{
    console.log(err.name , err.message) ; 
    console.log('Unhandled Rejection , Shutting down') ; 
    server.close(()=>
    {
        process.exit(1) ;   // 1 for expection exception
    });
    
})    

// test