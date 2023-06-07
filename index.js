const express=require("express")
const app=express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use("/",express.static("public"))
app.use("/flappy",express.static("public-flappy"))
app.use("/galaxy",express.static("public-galaxy"))
app.use("/pacman",express.static("public-pacman"))

app.get("/",function(req,res){
    console.log(__dirname);
    res.write("hellowold");
    res.sendFile(__dirname+"/public/index.html")
})

app.get("/flappy",function(req,res){
    res.sendFile(__dirname+"/public-flappy/index.html");
})
app.get("/galaxy",function(req,res){
    res.sendFile(__dirname+"/public-galaxy/index.html");
})
app.get("/pacman",function(req,res){
    res.sendFile(__dirname+"/public-pacman/index.html");
})

app.listen(3000,function(){
    console.log("Listening on port 3000")
})  