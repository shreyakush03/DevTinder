const express = require("express")


const app = express();

// handling the code
// app.use((req,res) =>{
//     res.send("hello from thr server") ///this function handles the code
// })
app.use("/test",(req,res) =>{
    res.send("test server") ///this function handles the code
})


app.listen(7777, ()=>{
    console.log("server is successfully listening on port 7777")
})
