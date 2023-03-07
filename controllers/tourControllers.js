const Tour  = require('../models/tourModel') ; 
const APIFeatures = require('./../utils/apiFeatures') ; 



// this is common middleware whcih chck validity of array length (applicable for static data)
/*
exports.checkID  = (req , res , next , val)=>
{
    console.log(`Tour id is :${val}`) ;
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json(
            {
                status : 'fail' , 
                message : 'Invalid ID'
            }
        );
    }

    next() ; 
}*/

// here we add conditions in query for getting the specific results .

exports.aliasTopTours = (req , res , next)=>
{
    req.query.limit = '5' ;
    req.query.sort='-ratingsAverage , price' ;
    req.query.fields ='name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req , res)=>
{
    try
    {
        const features = new APIFeatures(Tour.find() , req.query)
        .filter() 
        .sort()
        .limit()
        .paginate()
        ; 

        console.log(features.query) ; 
        // Execute Query 
        const tours = await features.query ;
        
        // Send response 
        res.status(200).json({
        status :'Success' ,
        length : tours.length, 
        tours
        });
    }
    catch(err)
    {    
        res.status(404).json({
            status : 'fail' , 
            message : err      
        });
    }
    
};

exports. getTour = async(req , res)=>
{
    try
    {
        // Tour.findone({_id : req.params.id}) ; 
        const tour = await Tour.findById(req.params.id) ; 
        res.status(200).json(
            {
                status : 'success'  ,
                data : tour 
            }
        )
    } 
    catch(err)
    {
        res.status(404).json(
            {
                status : 'fail' ,
                message : err 
            }
        );
    }
};

exports.newTour = async (req ,res)=>
{
    /*const newTour = new Tour({}) ; 
    newTour.save() ;
    */

    // these both lines are same 

    try 
    {
        const newTour = await Tour.create(req.body);
    
        res.status(201).json({
        status : 'success' , 
        data :
        {
            tour : newTour 
        }
    });
    }
    catch(err) {
        res.status(400).json(
            {
                status : 'fail',
                message : err 
            }
        )
    }
    
};
exports. updateTour = async (req , res)=>
{
    try
    {
        // here this true method return back to client
        const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true 
        })
        
        res.status(200).json(
            {
                status : 'success' , 
                data : 
                {
                    tour : tour 
                }
            }
        )

    }
    catch(err)
    {
        res.status(404) 
        .json({
            message : 'fail' , 
            error : err 
        })
    }
    
}; 
exports. deleteTour = async(req , res)=>
{
    try
    {
        await Tour.findByIdAndDelete(req.params.id) ; 
        return res.status(204).json(
            {
                status : 'success' , 
                data : null 
            }
        )
    }

    catch(err)
    {
        res.status(404)
        .json({
            message : 'fail' , 
            error : err 
        })
    }
    
};  