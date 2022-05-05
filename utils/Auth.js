const passport=require("passport");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const User= require("../models/User");// Model name is User

const {SECRET}= require(`../config`);



/**
 *Here we will write code to Register the User
 * */

const userRegister= async (userDets,role,res)=>{
  try {
      /*Validate UserName check
  *
  * Chech weather the User Name Already exixst  the Data Base
  * */

      let usewrnameNotTaken= await validateUsername(userDets.username);
      if (!usewrnameNotTaken){
          return res.status(400).json({
              message:`Username is Already Taken`,
              success:false
          });
      }
      /*Validate Email check
   *
   * Chech weather the Email Already exixst  the Data Base
   * */
      let emailNotRegistered= await validateEmail(userDets.email);
      if (!emailNotRegistered){
          return res.status(400).json({
              message:`Email is Already Registared`,
              success:false
          });
      }

      // if compiler comes here it means No user name and Password exist ata Base
      //Get the Hashed Password
      const hashedpassword= await bcrypt.hash(userDets.password,12);
      //Create New User
      const newUser= new User({
          ...userDets,              //we have used ... so that it will collect all data
          password:hashedpassword,
          role                     //it mens role:role but in es6 we can simply write it as role
      });
      await newUser.save();
      return res.status(201).json({
          message:"You have successfully Registared, Now you can Login",
          success:true
      });

  }catch (err) {
      return res.status(500).json({
          message:"Unable to create Account.",
          success:false
      });
  }
};
/**
 *Here we will write code to login the User
 * */

const  userLogin=async (userCreds,role,res)=>{
    let {username,password}=userCreds;  // here we will get value of username and password from "userCreds" object
    //first check if the user name is in database
    const user= await User.findOne({username});
    if(!user){
        return res.status(404).json({
            message: "User name not found. Invalid login credentials",
            success:false
        });
    }
    //now we can check the Role
    if (user.role!=role){
        return res.status(404).json({
            message: "User Role not found. Invalid login Role credentials",
            success:false
        });
    }

    //if compiler comes in this position that means user is existing and tryinf ti sifnin for the right portal
    //now chwck for password
    let isMatch= await  bcrypt.compare(password,user.password);
    if (isMatch){
        //signin the token and issue it to the user
        let token= jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
            },SECRET, {expiresIn:"7 days"}
            );// in this way we can create signin Token
         // using the token create result object which will be sent to the frontend user
         let result={
             username:user.username,
             role:user.role,
             email:user.email,
             token:`Bearer ${token}`,
             expiresIn: 168
         }
         return res.status(200).json({
             ...result,
             message:"Hurry you are now Loggedin",
             success:true
         });

    }else {
        return res.status(404).json({
            message: "iscorrect Password",
            success:false
        });
    }

};

const  validateUsername=async (username)=>{
    let user=await User.findOne({username});
    return user?false:true;
}

//Desc of Passport Middlewere
const userAuth=passport.authenticate('jwt', { session: false });

//Desc Check of Role Middlewere
 const checkRole= roles=> (req,res,next)=>{        //function checkRole(roles){
        if(roles.includes(req.user.role)){
           return next();
        }                                            // function(req,res,next){ }
        return  res.status(401).json({
          message: "Unauthorized",
          success: false
        });                                           // }
};

const  validateEmail=async (email)=>{
    let user=await User.findOne({email});
    return user?false:true;
};

const serializeUser= user=>{  // used to not to show pass field from our main req.user
    return{
        username:user.username,
        email: user.email,
        name:user.name,
        _id:user._id,
        updatedAt:user.updatedAt,
        createdAt:user.createdAt
    }
}

module.exports={
    checkRole,
    userLogin,
    userRegister,
    userAuth,
    serializeUser
}
