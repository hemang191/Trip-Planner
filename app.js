const fs = require('fs') ; 
const express = require('express') ; 

const app = express() ; 

app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req , res)=>
{
    res.status(200).json({
        status :'Success' ,
        results : tours.length, 
        data:{
            tours : tours
        }
    })
};

const getTour = (req , res)=>
{
    const id = req.params.id * 1 ; 
    if(id > tours.length )
    {
        return res.status(404).json(
            {
                status : 'fail' , 
                message : 'invalid ID' 
            }
        )
    }
    const tour = tours.find(el => el.id === id )  
    res.status(200).json({
        status : 'success' ,
        data:
        {
            tour
        }
    })
};

const newTour = (req ,res)=>
{
   const newId = tours[tours.length-1].id+1 ; 
   const newTour = Object.assign({
    id: newId
   } , req.body); // this will create a new object

   tours.push(newTour);
   fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours) , err=>
    {
        res.status(201).json({
            status : 'success' , 
            data:
            {
                tour: newTour
            }
        });
    });
};
const updateTour = (req , res)=>
{
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json(
            {
               status : 'failure' 
            }
        )
    }
    res.status(200).json(
        {
            status : 'success' , 
            data : 
            {
                tour : 'Tour updated'
            }
        }
    )
}; 

const deleteTour = (req , res)=>
{
    if(req.params.id * 1 > tours.length)
    {
        return res.status(404).json(
            {
               status : 'failure' 
            }
        )
    }
    return res.status(204).json(
        {
            status : 'success' , 
            data : null 
        }
    )
}; 


app
   .route('/api/v1/tours')
   .get(getAllTours) 
   .post(newTour) ; 
 
app
   .route('/api/v1/tours/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour) ; 

// PUT : entire new object come 
// PATCH : when property of object got updated 

// applying question mark to url make it optional 
// '/api/:x/:y? (so here y is optional)


const PORT = 3000 ; 
app.listen(PORT , ()=>
{
    console.log("App is running on PORT no " , PORT) ; 
})