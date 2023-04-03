const Tour  = require('../models/tourModel') ; 
const APIFeatures = require('./../utils/apiFeatures') ; 

const catchAsync = require('./../utils/catchAsync') ; 
const AppError = require('./../utils/appError');
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

exports.getAllTours = catchAsync(async (req , res , next)=>
{
    const features = new APIFeatures(Tour.find() , req.query)
        .filter() 
        .sort()
        .limit()
        .paginate()
        ; 

        
        // Execute Query 
        const tours = await features.query ;

        // Send response 
        res.status(200).json({
        status :'Success' ,
        length : tours.length, 
        tours
        });
    });

exports. getTour = catchAsync(async(req , res , next)=>
{
    // Tour.findone({_id : req.params.id}) ; 
    const tour = await Tour.findById(req.params.id) ; 

    if(!tour)
    {
        return next(new AppError('NO tour found with that ID' , 404))
    }

    res.status(200).json(
    {
        status : 'success'  ,
        data : tour 
    })
});


exports.newTour = catchAsync(async (req ,res , next)=>
{
    
    const newTour = await Tour.create(req.body);
    
        res.status(201).json({
        status : 'success' , 
        data :
        {
            tour : newTour 
        }
    });
    
});
exports. updateTour = catchAsync(async (req , res , next)=>
{
    // here this true method return back to client
    const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
        new : true ,
        runValidators : true 
    })
    if(!tour)
    {
        return next(new AppError('NO tour found with that ID' , 404))
    }

    res.status(200).json(
    {
        status : 'success' , 
        data : { tour : tour }
    }
    )
}); 
exports. deleteTour = catchAsync(async(req , res , next)=>
{
   const tour = await Tour.findByIdAndDelete(req.params.id) ; 

    if(!tour)
    {
        return next(new AppError('NO tour found with that ID' , 404))
    }

    return res.status(204).json(
    {
                status : 'success' , 
                data : null 
    })
});  

// this routes helps us to make group of the routes which share some common properties 
exports.getTourStats = catchAsync(async(req , res , next)=>
{
    const stats = await Tour.aggregate(
    [
       {
        $match : {ratingsAverage : {$gte: 4.5 } }},
        {
         $group : {  _id : null , 
                    avgRatings:{$avg :'$ratingsAverage'},
                    avgPrice : {$avg : '$price'},
                    minPrice : {$min : '$price'},
                    maxPrice : {$max :'$price'}}
        }
            ]
        ); 
        res.status(200).json(
            {
                status : 'success' ,
                data :
                {
                    stats
                }
            }
        )
    
   
}) ;   

exports.getMonthlyPlan = catchAsync(async (req , res , next)=>
{
    const year = req.params.year * 1 ; //2021

    const plan = await Tour.aggregate([
    {
      $match : 
       {
         startDates: {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)}
        }
    },
   {
    $project: 
    {startDates: 1, name: 1 
        // Add any other fields you want to include in the output 
    }},
    {
       $unwind : '$startDates' // it will make various objects which starts from same date.
    },
    {
      $group :
       {
           _id : {$month : '$startDates'},
            numTourStats : {$sum : 1},
            tours : {$push : '$name'}
       }        
    },
    {
            $addFields: {month :'$_id'}
    },
    {
        $project :
        {
            _id : 0 
         }
    },
    {
        $sort :
        {
           numTourStarts : -1 
        }
    }
    ]) ; 
    res.status(200).json(
    {
        status : 'success' , 
        data: 
        {
            plan 
        }
    })
}); 