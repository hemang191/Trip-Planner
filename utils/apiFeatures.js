class APIFeatures
{
    constructor(query , queryString) 
    {
        this.query = query ; 
        this.queryString = queryString
    }
    filter()
    {
        // it will make a real hard copy of object not just reference   

        // BUILD QUERY 

        // 1st step --> Filtering 
        

        // here req.query contains an object which can be passed with find method of mongoose
       
       // let query = Tour.find(JSON.parse(queryStr)) ; 
        const queryObj = {...this.queryString}  ;

        const excluded_fields = ['page' , 'sort' , 'limit' , 'fields'] ; 

        // remove all those fields from queryObj 

        excluded_fields.forEach(el => delete queryObj[el]); 
  
        // Advanced filtering suppose if we have to find the tour which have price >= 1000 
        // then the mongoose query will generate different 

        // 2nd Step -> Advance filtering.

        let queryStr = JSON.stringify(queryObj) ; 
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match=>`$${match}`) ;

        this.query = this.query.find(JSON.parse(queryStr)) ; 
        return this ; 

    }

    sort()
    {
        // 3rd step --> apply sortin feature 
        if(this.queryString.sort)
        {
            //query = query.sort(req.query.sort) ; -> it is only useful when there is single field .
            const sortBy = this.queryString.sort.split(',').join(' ') ;  
            query = query.sort(sortBy) ; 
        }
        else 
        {
            this.query = this.query.sort('-createdAt') ; 
        }     

        return this ; 
    }

    limit()
    {
        // 3. Field Limiting when we want to select only few fields 
        if(this.queryString.fields)
        {
            const fields = this.queryString.fields.split(',').join(' '); 
            // selecting only few fields 
            this.query = this.query.select(fields)
         }
         else 
         {
            this.query = this.query.select('-__v');
         }

        return this ; 
    }

    paginate()
    {
        // 4. Adding pagination -> if we have millions of data in database and want to display in form of pages 
    const page = this.queryString.page * 1 || 1 ; 
    const limit = this.queryString.limit * 1 || 100 ; 
 
    const skip = (page-1) * limit ; // skip here refer to skip no of items as we select page 3 and limit = 10 then skip 20 items and display from 21 to 30 
 
    this.query = this.query
    .skip(skip)
    .limit(limit);

    return this ; 
    }
}

module.exports = APIFeatures ; 