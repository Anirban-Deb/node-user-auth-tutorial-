const cors= require("cors");
const exp = require("express");
const bp  =  require("body-parser");
const passport= require("passport");
const {connect} =require ("mongoose");
const {success,error}=require("consola");


//Note about this page:
//Here we have written code such a way that
//mongo connected first and than servet


//Bring the App Constant
const {DB,PORT} =require ("./config");

//initilaze the Application
const app=exp();
//Middlewares
app.use(cors());//Enable Cress Platform Compatibility
app.use(bp.json());//Enable(Register) Body Parser in the Application
app.use(passport.initialize());  // it is required if we want passport object in middlewere

require("./middlewares/passport")(passport) // here we attached passport as function argumernt for "passport" middlewere function
//User Router Middlewere
app.use("/api/users",require("./routes/users"));




//Connect With DB
const startApp=async ()=>{
    
try {
    //database connection
    await connect(DB,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    });
    //if successfully connected then following code block run
    success({message:`DB connected Successfully on ${DB}`,badge:true})
    //Server connection
    app.listen(PORT, ()=>
        success({message:`Server connected Successfully on ${PORT}`,badge:true}))
}catch (err) {  //if any issue occour regarding connection then this code block runs
    startApp(); //We have used this function call to ensure that if error occour
                //means database is not connected before server it will recursevebly call
                // the Same Function. So it ensure both connection(first DB than Server) run at the sme time
    error({
        message: `DB not connected Successfully on ${err}`,badge:true
    });
}
}

startApp();


