const express = require('express') ;
const tourController = require('../controllers/tourControllers') ; 


const router  = express.Router() ;

// it is param middleware which checks validation of user id
//router.param('id' , tourController.checkID) ; 
router
   .route('/top-5-cheap')
   .get(tourController.aliasTopTours , tourController.getAllTours ) ;    


router 
   .route('/')
   .get(tourController.getAllTours) 
   .post( tourController.newTour) ; 
 
router
     .route('/tour-stats' )
     .get(tourController.getTourStats);


router
      .route('/monthly-plan/:year')
      .get(tourController.getMonthlyPlan) ; 
     
router 
   .route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour) ; 


module.exports = router ; 