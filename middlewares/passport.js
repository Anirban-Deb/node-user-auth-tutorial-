const User= require("../models/User");
const {SECRET} =  require("../config");
const {Strategy, ExtractJwt} =require("passport-jwt");

                                                  // All the code comming from "passport-jwt"
                                                               // Middlewere, we gave  to use jwtFromRequest and
                                                                //secretOrKey according to the Documantation of "passport-jwt"
const opts= {                                                            //secretOrKey according to the Documantation of "passport-jwt"
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

module.exports=passport=>{
    passport.use(
        new Strategy(opts,async (payload,done)=>{
            await User.findById(payload.user_id)
                .then(user=>{
                    if (user){
                        //i can use Logger funmction here  can use Morgan or Wisted package to track the
                        return done(null,user);
                    }
                    //i can use Logger funmction here
                    return done(null,false);

                }).catch((err)=>{
                    return done(null,false);
                });
        })
    );
};