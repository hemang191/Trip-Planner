const mongoose = require('mongoose') ; 
const validator = require('validator') ; 
const bcrypt = require('bcrypt') ; 
// create a schema have name , email, photo password , passwordConfirm

const userSchema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            required: [true , 'Please tell your name'] 
        },
        email :
        {
            type :String ,
            required: [true , 'Please provide email'] ,
            unique : true ,
            lowercase : true ,
            validate : [validator.isEmail, 'please provide a valid mail'] 

        },
        photo:
        {
            type : String 
        },
        password :
        {
            type : String ,
            required  : [true , 'Please provide password'],
            minlength : 4,
            select : false  // now never show in the output

            
        },
        passwordConfirm:
        {
            type : String  ,
            required : [true , 'Please confirm your password'] ,
            minlength : 4  ,
            // here we are creating our custom validator to check wether it is equal to password or not 


            // this only works on CREATE & SAVE method , for find and update we have to use other one . 
            validate : {
                validator : function(el)
                {
                    return el=== this.password 
                }
            },
            message : 'Passwords  are not same..'
            
        }
    }
);

userSchema.pre('save' , async function(next)
{
    // encrypt when only password is updated or modified

    if(!this.isModified('password'))
    {
        return next() ; 
    }

    // bcrypt algorithm

    this.password = await bcrypt.hash(this.password , 12) ; 

    this.passwordConfirm = undefined ; // only need to store single password in database . 
})
const User = mongoose.model('User' , userSchema) ; 
module.exports = User ;    