const mongoose = require('mongoose') ;
const slugify = require('slugify') ;
const validator = require('validator') ; 


const tourSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : [true , 'A tour must have a name'] ,
        unique : true  ,
        trim : true ,
        maxlength : [40 , 'A tour must have less or equal 40 characters.'],
        minLength : [5 , 'A tour must have more or equal 5 characters'] 
    },
    slug : String ,

    duration : 
    {
        type : Number ,
        required : [true , 'A tour must have duration'] 
    }, 
    maxGroupSize:
    {
        type : Number , 
        required : [true , 'A tour must have group size']
    },
    difficulty :
    {
        type : String , 
        required : [true , 'A tour must have a difficulty'],
        enum : {
        values : ['easy' , 'medium' , 'difficult'],
        message : 'Difficulty is either easy , medium or difficult'}
    },
    ratingsAverage : {
        type : Number , 
        default : 4.5 ,
        min: [1 , 'Rating must be above 1.0'] , 
        max : [5 , 'Rating must be below or equal 5.0'] 
    },
    ratingsQuantity:
    {
        type : Number , 
        default : 0 
    },
    price : {
        type : Number , 
        required : [true , 'A tour must have a price'] 
    },
    priceDiscount : {
        type : Number ,
        validate : {
            validator : function(val)
            {
                return val < this.price ; 
            },
            message : 'Discout price ({VALUE}) should be below regular price' 
        }
    } , 
    summary : 
    {
        type : String , 
        trim : true ,
        required : [true , 'A tour must have a summary'] 
    },
    description :
    {
        type : String , 
        trim : true
    },
    imageCover : 
    {
        type : String ,
        required :[true ,'A tour must have a cover image']
    },
    images :[String],  
    createdAt : 
    {
        type : Date,
        default : Date.now(), 
        select : false 
    },
    startDates: [Date], // different instances at which tour starts 
    secretTour :
    {
        type : Boolean ,
        default : false
    }

});
   
// those fields which don't save in our database 

tourSchema.virtual('durationWeeks').get(function()
{
    return this.duration / 7 ;
})

// Document Middleware 

/*
// Document middleware run for save and create not on insert many 


// pre save hook 
tourSchema.pre('save' , function(next)
{
    console.log(this) ; // this is current object

    this.slug = slugify(this.name , {lower : true}) ;
    next();
})


// post save hook 
tourSchema.post('save' , function(doc, next)
{
    console.log(doc) ; // last saved document

    next() ; 

})

*/

// Query Middleware 


// suppose we have secret tour present in our database

// so secret tours never appear in output .


// but this hook only available for find command not the other command which start with find , so identity of secret tour can be reveal from them . So we also have to make hooks for them or pass the variable string /^find/

tourSchema.pre('/^find/' , function(next)
{
    this.find({secretTour : {$ne : true }}) ; 
    next() ; 
})

tourSchema.post('/^find/' , function(docs , next)
{
   // console.log(docs) ; all document that match query
    next() ; 
})


// aggregation middleware 

tourSchema.pre('aggregate' , function(next)
{
    this.pipeline().unshift({$match : {secretTour : {$ne : true } } } ) ; 

    // just add match property to front side of the array . 
    
    next() ; 
})
const Tour = mongoose.model('Tour' , tourSchema) ; 

module.exports = Tour ; 