const express = require("express")
const {adminAuth} = require("./middlewares/auth")


const app = express();

app.use("/admin",adminAuth)
// app.get("/User", (req , res)=>{
//     // res.send("Route handler 1")
//     // console.log("handling route user 2 !!!")
//     res.send("user route handler")
// })

app.get("/admin/getalldata", (req,res)=>{
    res.send("All data sent")
})

app.get("/admin/DeleteData" , (req,res)=>{
    res.send("data deleted successfully!!!!!")
})



app.listen(7777, ()=>{
    console.log("server is successfully listening on port 7777")
})
