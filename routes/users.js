const router= require("express").Router();

const {userRegister,userLogin,userAuth,serializeUser,checkRole} = require("../utils/Auth")

//User Registraton  Route
router.post("/register-user",async (req,res)=>{
    await userRegister(req.body,"user",res);
});
//Admin Registraton  Route
router.post("/register-admin",async (req,res)=>{
    await userRegister(req.body,"admin",res);
});
//Super Admin Registraton  Route
router.post("/register-super-admin",async (req,res)=>{
    await userRegister(req.body,"superadmin",res);
});
//User Login
router.post("/login-user",async (req,res)=>{
    await userLogin(req.body,"user",res);
});
//admin Login
router.post("/login-admin",async (req,res)=>{
    await userLogin(req.body,"admin",res);
});
//Super Admin Login
router.post("/login-super-admin",async (req,res)=>{
    await userLogin(req.body,"superadmin",res);
});

//After this point all the other Routes bolow Used for "Passport" Authentication.
//it basically protect route, We wse this as a mddlewere to filter the user and allow user to use
//particular endpoint api.
//Profile Route
router.get("/profile",userAuth,async (req,res)=>{

    return res.json(serializeUser(req.user)); //serializeUser not to show the password from req.user object
})
//User Protected Route
router.get("/user-protected",userAuth,checkRole(['users']),async (req,res)=>{});
//Admin Protected Route
router.get("/admin-protected",userAuth,checkRole(['admin']),async (req,res)=>{});
//Super-Admin Protected Route
router.get("/super-admin-protected",userAuth,checkRole(['superadmin']),async (req,res)=>{});
// For both superadmin and admin
router.get("/super-admin-protected",userAuth,checkRole(['admin','superadmin']),async (req,res)=>{});
module.exports=router;