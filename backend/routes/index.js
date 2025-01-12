const express=require("express");
const useRouter=require("./user")


const router=express.Router();

router.use("/user",useRouter);

module.exports=router;

