const express = require("express")
const {adminAuth} = require("./middlewares/auth")


const app = express();


app.get("/getuserData",(req,res)=>{
    try{
        
            throw new Error("hfdhks")
          res.send("User data sent")

    }
    catch(err){
        res.status(500).send("Error occurred, contact support teams")
    }

})

app.use("/",(err,req,res,next)=>{
    // if(err){
    //     // log your error
    //     res.status(500).send("something went wrong")
    // }
})

app.listen(7777, ()=>{
    console.log("server is successfully listening on port 7777")
})
