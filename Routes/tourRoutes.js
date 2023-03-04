const express = require('express') ;
const tourController = require('../controllers/tourControllers') ; 


const router  = express.Router() ;

// it is param middleware which checks validation of user id
//router.param('id' , tourController.checkID) ; 

router 
   .route('/')
   .get(tourController.getAllTours) 
   .post( tourController.newTour) ; 
 
router 
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour) ; 


module.exports = router ; 