const express = require("express")


const app = express();

app.get("/user",(req,res) =>{
    res.send({firstname:"Shreya Kushwaha",lastname:"kushwaha"})
})

app.post("/user",(req,res) =>{
    res.send("post request successfully done")
})

app.delete("/user",(req,res)=>{
    res.send("delete request successfylly done")
})

// handling the code
app.use("/test",(req,res) =>{
    res.send("test server") ///this function handles the code
})
// app.use("/",(req,res) =>{
//     res.send("hello from thr server") ///this function handles the code
// })


app.listen(7777, ()=>{
    console.log("server is successfully listening on port 7777")
})
