const mongoose = require('mongoose') ; 
const dotenv = require('dotenv');
dotenv.config({path : './config.env'}) ;

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
app.listen(PORT , ()=>
{
    console.log("App is running on PORT no " , PORT) ; 
})    
   